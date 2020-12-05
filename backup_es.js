import boto3
import requests
# from botocore.vendored import requests
from requests_aws4auth import AWS4Auth

import json
from datetime import date

def lambda_handler(event, context):
  host = 'https://search-productdata-gewson6zruy7khdgnogwvy5jha.ap-southeast-2.es.amazonaws.com'  # include https:// and trailing /
  region = 'ap-southeast-2'  # e.g. us-west-1
  service = 'es'
  credentials = boto3.Session().get_credentials()

  # AKIA2APUUDCE2XAVRZ5C
  # ZNFDOswHqkmfzKnbLd82+OxTPAsH+2mbFnL3s+K0
  
  awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
  print(awsauth)
  # Register repository
  today=date.today()
  path = '/_snapshot/snapshot.es/'+str(today)
  url = host + path
  print(url)

  payload = {
    "type": "s3",
    "settings": {
      "bucket": "snapshot.es",
      "region": "ap-southeast-2",
      "role_arn": "arn:aws:iam::688244660361:role/lambda_snapshot_es"
    }
  }

  headers = {"Content-Type": "application/json"}

  r = requests.put(url, headers=headers)
  print(r.status_code)
  print(r.text)

  return {
        'statusCode': r.status_code,
        'body': [r.text]
    }


# if __name__ == "__main__":
#   lambda_handler(1,1)
