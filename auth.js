// Initialize AWS Cognito configuration
AWSCognito.config.region = 'us-east-1'; // e.g., 'us-west-2'
AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'your-identity-pool-id', // e.g., 'us-west-2:12345678-1234-1234-1234-123456789012'
});

var poolData = {
    UserPoolId: 'us-east-1_OvNMNxb2k', // Your Cognito User Pool ID
    ClientId: 'your-app-client-id' // Your Cognito App Client ID
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to register a new user
function registerUser(email, password) {
    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: email
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(email, password, attributeList, null, function(err, result) {
        if (err) {
            console.error(err.message || JSON.stringify(err));
            return;
        }
        var cognitoUser = result.user;
        console.log('User registration successful: ' + cognitoUser.getUsername());
        // User is registered but not confirmed.
    });
}

// Function to authenticate a user
function loginUser(email, password) {
    var authenticationData = {
        Username: email,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.log('Authentication successful');
            // Use the result.getIdToken().getJwtToken() to get the JWT token
        },
        onFailure: function(err) {
            console.error(err.message || JSON.stringify(err));
        },
    });
}

// Function to check for the current user session
function checkSession() {
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.error(err.message || JSON.stringify(err));
                return false;
            }
            console.log('Session valid: ' + session.isValid());
            // Here you can also refresh or retrieve tokens
            return session.isValid();
        });
    }
}
