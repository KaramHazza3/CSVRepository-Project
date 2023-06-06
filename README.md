# CSV Repository
CSV Repository is a file storage system that allows users to upload, delete, and download CSV files through a web interface. The repository also provides the ability to view files in JSON format based on the user's role. This README provides an overview of the system's architecture and components.

# API Gateway
The API Gateway is implemented as an HTTP API due to issues encountered with the traditional REST API. The HTTP API ensures proper recognition of the selected CSV file's content by using the "Content-Type: text/csv" header. Routes are utilized to consolidate multiple Lambda functions under a single base URL, reducing the need for multiple APIs.

# Lambda Functions
Lambda functions are designed to adhere to the Single Responsibility Principle (SRP). The upload lambda function utilizes the Simple Notification Service (SNS) to send a notification containing the filename and file content. Another function subscribes to the SNS topic and retrieves the filename and content. The necessary permissions for sending and receiving messages are granted to the Lambda functions interacting with the SNS topic.

Encryption using the Key Management Service (KMS) is employed during file upload. The uploaded file is encrypted and subsequently decrypted during retrieval. Custom KMS policies are created to enable this functionality and are attached to the relevant entities interacting with KMS.

Similar to the upload function, the delete function leverages SNS to notify other functions about the deletion action. In this case, file content is not required. Permissions are granted to the functions interacting with the SNS topic, and separate topics are used to distinguish between receivers and their messages.

Certain Lambda functions, such as Delete and Upload, require a QueryStringParameter to complete their tasks. This parameter specifies the selected file's name, which can be chosen in the front-end (FE) user interface.

# S3 Bucket
The S3 Bucket is configured with Access Control Lists (ACLs) to manage access to stored objects. The ShowAllFiles Lambda function, triggered by the base URL of the HTTP API, is granted read-only permissions to the bucket. Additionally, KMS encryption is applied to the stored objects using a customized policy. This ensures that objects are encrypted at rest and decrypted when downloaded.

Conflicting object names are handled by overwriting the previously stored object in the S3 bucket with the newer one. DynamoDB performs a check for existing table names and deletes them if found, allowing the new data to be inserted, even if it is identical to the previous table. This ensures that updates are properly applied.

# DynamoDB
DynamoDB tables are dynamically created by a Lambda function when it receives the filename and its content. The function splits the lines and extracts the first line as the headers array. Subsequent lines, starting from index 1, constitute the data. Each key-value pair is assigned to its respective header, and the array of objects representing each line is converted to JSON using JSON.stringify(). This JSON representation allows users to view the table as JSON when downloading a selected file.

# CloudWatch
CloudWatch plays a crucial role in debugging errors and providing insights during development. Console.log() statements are utilized to print variable values for debugging purposes. Try-catch blocks are used to capture errors and return appropriate error responses through the API.

# Cognito (User Pool)
Cognito is employed to create a user pool for user authentication in the login UI. Only specific users belonging to designated groups are allowed to access the system. Each group is assigned specific permissions (e.g., reader, staff, admin). Angular is used to connect each API to its respective function, and permissions are compared to hide unauthorized actions in the user interface.

# GitHub and AWS Amplify
The project is hosted on GitHub, allowing the use of AWS Amplify for deployment. Amplify handles the installation of required dependencies and monitors changes made in the GitHub

# Compononets of the system and how they interact together
![Capture](https://github.com/KaramHazza3/CSVRepository-Project/assets/77400199/2470a2b3-4c6b-447a-9749-6242668676b9)
