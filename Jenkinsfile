pipeline {
    agent any 
    
    // Define environment variables needed for the pipeline
    environment {
        // You will set these as secret credentials in Jenkins UI 
        AZURE_CRED_ID = 'your-azure-service-principal-id' 
        ACR_REGISTRY  = 'YOUR_ACR_LOGIN_SERVER' // e.g., nextjsregistry1234.azurecr.io
        RG_NAME       = 'rg-nextjs-cicd'
        WEBAPP_NAME   = 'app-nextjs-ci-cd-1234'
        IMAGE_NAME    = "${ACR_REGISTRY}/nextjs-app"
        IMAGE_TAG     = "latest" // Or use a unique build number: "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Initialize & Checkout') {
            steps {
                echo 'CI/CD Pipeline Started...'
                // The Git plugin handles the checkout based on job configuration
                sh 'git rev-parse HEAD > .git/commit-id'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile
                    // sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .' // Basic build
                    // If Jenkins runs on a Linux agent with Docker access
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}", ".") 
                }
            }
        }
        
        stage('Login to ACR & Push Image') {
            steps {
                // Use the Service Principal credentials configured in Jenkins
                withCredentials([azureServicePrincipal(credentialsId: env.AZURE_CRED_ID, subscriptionIdVariable: 'AZURE_SUBSCRIPTION_ID', clientIdVariable: 'AZURE_CLIENT_ID', clientSecretVariable: 'AZURE_CLIENT_SECRET', tenantIdVariable: 'AZURE_TENANT_ID')]) {
                    sh "az login --service-principal -u \$AZURE_CLIENT_ID -p \$AZURE_CLIENT_SECRET --tenant \$AZURE_TENANT_ID"
                    sh "az acr login --name ${ACR_REGISTRY}"
                    
                    // Push the newly built image to Azure Container Registry
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to Azure Web App') {
            steps {
                withCredentials([azureServicePrincipal(credentialsId: env.AZURE_CRED_ID, subscriptionIdVariable: 'AZURE_SUBSCRIPTION_ID', clientIdVariable: 'AZURE_CLIENT_ID', clientSecretVariable: 'AZURE_CLIENT_SECRET', tenantIdVariable: 'AZURE_TENANT_ID')]) {
                    // The Azure CLI command to update the Web App with the new image
                    sh """
                    az webapp config container set \
                        --resource-group ${RG_NAME} \
                        --name ${WEBAPP_NAME} \
                        --docker-custom-image-name ${IMAGE_NAME}:${IMAGE_TAG} \
                        --docker-registry-server-url https://${ACR_REGISTRY}
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup or notification steps
            echo 'Pipeline finished.'
        }
        success {
            echo 'Deployment successful! Check the Azure Web App.'
        }
        failure {
            echo 'Deployment failed! Check the console output for errors.'
        }
    }
}