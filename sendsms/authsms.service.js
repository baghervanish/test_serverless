"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Authsms = require('./authsms.model');
const config = require("config");
const Response = require("../../classes/response");
const Lib = require("../../libs/common");
const MoleculerError = require("moleculer").Errors.MoleculerError;
const ForbiddenException = require('../../libs/exceptions').ForbiddenException;
const NotFoundException = require('../../libs/exceptions').NotFoundException;
const schemaValidationException = require('../../libs/exceptions').schemaValidationException;
module.exports = {
    name: "authsms",
    model: Authsms,
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI || config.get("MONGO_URI")),
    settings: {
        fields: ["_id"]
    },
    hooks: {
        before: {
            async insert(ctx) {
                try {
                    await Lib.validateSchema(ctx, Schema.insert);
                }
                catch (err) {
                    throw err;
                }
            },
            async update(ctx) {
                try {
                    await Lib.validateSchema(ctx, Schema.update);
                }
                catch (err) {
                    throw err;
                }
            },
        },
        error: {
            async "*"(ctx, err) {
                console.log(err);

                let response = new Response();
                response.success = false;
                response.result = {};
                response.time = new Date();
                

                if (err instanceof NotFoundException) {
                    response.message ="Not Found!"
                    if (err.message = "Not Correct password") {
                        response.errorCode = 'ncp'
                        return response;
                    };
                }

                if (err instanceof ForbiddenException) {
                    response.message ="Not Found!"
                    if (err.message = "You are not allowed to receive the password for to two minutes") {
                        response.errorCode = 'narp2m'
                        return response;
                    };
                }

                if (err instanceof NotFoundException) {
                    response.message ="Not Found!"
                    if (err.message = "Not Found Sms Service!") {
                        response.errorCode = 'nfss'
                        return response;
                    };
                }
                
                if (err.code > 620) {
                    ctx.meta.$statusCode = 500;
                    response.message = err.errmsg;
                    response.errorCode = "5";
                    return response;
                }

                if (err instanceof ForbiddenException) {
                    response.message = err.message
                    response.errorCode = "3"
                    return response;
                }

                if (err instanceof NotFoundException) {
                    response.message = "Not Found!"
                    if (response.message = "Not Found!") {
                        response.errorCode = 'nnf'
                    };
                    return response;
                }

                if (err instanceof schemaValidationException) {
                    response.message = err.message
                    response.errorCode = "4";
                    return response;
                }
                else if (
                    !err instanceof NotFoundException &&
                    !err instanceof ForbiddenException &&
                    !err instanceof schemaValidationException &&
                    !err.code > 620
                ) {
                    ctx.meta.$statusCode = err.code;
                    response.message = err.message;
                    response.errorCode = err.type + "";;
                    return response;
                }
                else {
                    ctx.meta.$statusCode = 500;
                    response.message = err;
                    response.errorCode = "7";
                    return response;
                }
            }
        }
    },
    
    actions: {
        sendpass: {
            async handler(ctx) {
                // send sms pass  with webservices                  
                var fromdate = new Date();
                var todate = new Date(fromdate);
                todate.setMinutes(fromdate.getMinutes() + 2);

                let find_duplicate_verificationCode = await Authsms.findOne(
                    {
                        "toDate": { "$gte": fromdate }, "fromDate": { "$lte": todate }, "mobile": ctx.params.mobile
                    })
                
                    if (find_duplicate_verificationCode != null)
                    {
                            ctx.meta.$statusCode = 403;
                            throw new ForbiddenException("You are not allowed to receive the password for to two minutes");
                    }
                
                if (find_duplicate_verificationCode == null) {
                
                    let smssender = new Authsms({
                        mobile: ctx.params.mobile,
                        password: (Math.floor(Math.random() * 10000000) + 10000000).toString().substring(1),
                        fromDate: fromdate,
                        toDate: todate,
                        verify: false,
                    })

                    const result = await ctx.broker.call('sms.sendSms', {
                        "subject": "smsServiceTest",
                        "text": smssender.password,
                        "link": "http://tax.cpay.ir",
                        "reciverCellphone": smssender.mobile
                    });
                
                    if (!result || result.success == false) {
                        ctx.meta.$statusCode = 404;
                        throw new NotFoundException("not found sms service!");
                    }

                    if (result != null && result.success == true) {
                        smssender = await smssender.save()
                        var response = new Response();
                        response.success = true;
                        response.message = "Task List is created!";
                        response.result = {
                            mobile: smssender.mobile,
                        }
                        return response;
                    }
                }
            }
        },

        verifysms: {
            async handler(ctx) {
                try {
                    var date = new Date();
                    let finds = await Authsms.findOne(
                        {
                            "toDate": { "$gte": date }, "fromDate": { "$lte": date }, "mobile": ctx.params.mobile, password: ctx.params.pass
                        })

                    if (finds != null) {
                        let findsupdate = await Authsms.updateOne({ _id: finds._id }, { verify: true });
                        return {
                            result: "successful",
                        };
                    }

                    if (finds== null) {
                        ctx.meta.$statusCode = 404;
                        throw new NotFoundException("Not Correct password");
                    }
                }
                catch (err) {
                    throw err;
                }
            },
        },
    }
}

/*
 *  start 20-01-2020 16:48
 *  ......................
 *  end   21-01-2020 12:11
 */