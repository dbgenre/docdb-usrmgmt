# AWS DocumentDB User Management API

This API provides endpoints to manage local users in AWS DocumentDB instances. It handles user creation, role management, and user termination operations.

## Features

- Create local users in DocumentDB
- Allocate roles to users
- Revoke roles from users
- Terminate users
- List all users and their roles

## Prerequisites

1. AWS Account with DocumentDB instance(s)
2. AWS CLI configured with appropriate credentials
3. Node.js (v14 or higher)
4. npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd awsDocDB_usrmgmtAPI
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add the following:
```env
PORT=3000
AWS_REGION=your-aws-region
DOCDB_ENDPOINT=your-docdb-endpoint
DOCDB_PORT=27017
DOCDB_ADMIN_USERNAME=your-admin-username
DOCDB_ADMIN_PASSWORD=your-admin-password
```

## Usage

1. Start the server:
```bash
npm start
```

2. API Endpoints:

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "password": "userpassword",
  "roles": ["readWrite", "dbAdmin"]
}
```

### Allocate Role
```http
POST /api/users/:username/roles
Content-Type: application/json

{
  "roles": ["readWrite"]
}
```

### Revoke Role
```http
DELETE /api/users/:username/roles
Content-Type: application/json

{
  "roles": ["readWrite"]
}
```

### Delete User
```http
DELETE /api/users/:username
```

### List Users
```http
GET /api/users
```

## Security Considerations

1. Always use HTTPS in production
2. Implement proper authentication for API access
3. Store sensitive credentials in AWS Secrets Manager
4. Follow the principle of least privilege when assigning roles

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.