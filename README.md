# CSVRepository-Project

CSV Repository is a storage contains files in csv extention, you can upload/delete/download files from our website, you can also see any file in JSON format based on your role.

First let's talk about how we did API Gateaway, I made an HTTP API because i faced some problems with REST API such as it didn't recognize the content of selected csv file even with header "Content-Type: text/csv", then routes are required because we don't need to make many APIs for many lambda functions, we must have a base url for our application and routes are triggered with their lambdas functions.

Second lambda functions are made to meet the assignment requirements and in SRP, first, I made the upload lambda, I asked myself how another function will get the filename and its content if we will make the project in SRP, so I recognized that this is SNS usage. I send an SNS and another function subscribes to the topic and takes the filename and its content well. permission to send and receive messages required for lambdas that have interaction with the SNS Topic. Then KMS is required here on upload because you want an encrypted file to be uploaded and decrypted when retrieval, KMS custom policy is required to complete this task and attach it to who has interaction with KMS and objects needed to be encrypted or decrypted.
and the same idea for delete because you want if table deleted, the s3 object must be deleted too, so SNS usage came on my mind too like the previous idea but without file content because no need, and the required permissions for functions that have interaction with the SNS Topic, every action needs and SNS Topic to differentiate the receiver and it's messages.

some lambda functions like Delete and Upload and other lambda functions need a QueryStringParamter to complete their tasks because without it I don't think that anyone can do it, it specifies the file's name that has been selected and can be selected in FE (Front-End)

S3 Bucket with ACLS enabled to manage access to s3 stored objects to get all the available files for the ShowAllFiles lambda function that is triggered by the base URL of the HTTP API with ReadOnlyPermission and with KMS encryption (customized policy/permission) to encrypt the stored objects and decrypt when downloaded.

DynamoDB tables are created just from lambda function when it gets the filename and its content (body), it splits the lines and takes the first line as headers array (headers[0] is the first header and headers[1] is the second one.....) and the lines start from 1 is the data of the headers. When we convert them to JSON to show the table as JSON (file selected by a user to be downloaded in JSON format) we give every Key its Value, the Key is the header and the value is its value (of the header) and then we convert all the array that has objects of each line to JSON by doing JSON.stringify()

When the API notifies the functions that have interaction with SNS Topics, their subscribers got specific information about the file that needs (upload needs name and file content) and (delete just needs the file name to scan if the exists or not)

On the DownloadFile lambda function, I created a signedUrl (downloadUrl) with a 5min expiration time, I made that because on front end I will make the URL clicked without the user notice that, he can notice that the file just downloaded on his PC.

S3 Bucket Overwrites the object that is previously stored on the bucket with the newer one that has a conflict with the previous one because it has the same name by itself, and in DynamoDB I made it checks if the table name exists to delete it and put the new data even if the data is the same as the previous table to ensure that if there is an update not like the previous to put the newer table (that has the updates)

CloudWatch helped me a lot with debugging the errors and printing some variables for debugging too (console.log()) and the try catch blocks to return an error in API response if occurs.

User pool made by Cognito for Login Ui without signUp because i will create a specific users has a specific groups and the groups created has specific permissions
each group has a different pemissions (reader,staff,admin) staff can read and upload and reader can just read, i have connected each API on its function in Angular and i compared the permission to hide the action that he can't do it (the user) from its Ui

Finally, i pushed my project on github to use AWS Amplify which hosts my project and install the required dependencies if needed or lost and monotoring any changes made in GitHub to make the changes meet AWS services.

And if i forget to say that policies (permissions) are required for every lambda function that uses s3,dynamoDB, SNS and KMS are required to complete the tasks
i added to them and without them the lambda function is not authorized to write/read from any aws service without permissions, (When i want to upload on DynamoDB and S3 i need full access from s3 and dynamoDB etc...) and if i want just read i just need readonlypolicy
