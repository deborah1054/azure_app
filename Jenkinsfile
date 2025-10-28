pipeline {
    agent any 
    
    tools {
        jdk 'OpenJDK_17' 
    }
    
    environment {
        # --- Configuration ---
        # ⚠️ CRITICAL: Ensure 'nextjsregistryygwd.azurecr.io' is your actual Azure Container Registry (ACR) login server 
        ACR_REGISTRY = 'nextjsregistryygwd.azurecr.io'
        APP_IMAGE_NAME = 'nextjs-app'
        # The image tag will use the Jenkins build number for unique versioning
        DOCKER_IMAGE = "${ACR_REGISTRY}/${APP_IMAGE_NAME}:${BUILD_NUMBER}"
        AZ_RESOURCE_GROUP = 'rg-nextjs-cicd'
        AZ_APP_NAME = 'app-nextjs-ci-cd-ygwd'
    }
    
    stages {
        stage('Checkout Code') {
            steps { echo "Code checked out from ${env.GIT_URL}" }
        }
        
        stage('Install Dependencies') {
            steps { sh 'npm install' }
        }
        
        stage('Build Artifacts') {
            steps { sh 'npm run build' }
        }
        
        stage('Build & Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        # --- Authentication Setup ---
                        AZ_DATA='${AZURE_AUTH_JSON}'
                        APP_ID=\$(echo \${AZ_DATA} | grep -o '"clientId": *"[^"]*"' | awk -F'"' '{print \$4}')
                        SECRET=\$(echo \${AZ_DATA} | grep -o '"clientSecret": *"[^"]*"' | awk -F'"' '{print \$4}')
                        TENANT_ID=\$(echo \${AZ_DATA} | grep -o '"tenantId": *"[^"]*"' | awk -F'"' '{print \$4}')

                        echo "1. Logging in to Azure..."
                        az login --service-principal -u \${APP_ID} -p \${SECRET} --tenant \${TENANT_ID} --allow-no-subscriptions

                        echo "2. Logging in to Azure Container Registry: \${ACR_REGISTRY}"
                        # This command requires Docker to be installed on the Jenkins agent
                        az acr login --name \$(echo \${ACR_REGISTRY} | cut -d. -f1)

                        echo "3. Building Docker image: \${DOCKER_IMAGE}"
                        # The dot '.' means it looks for the Dockerfile in the current directory
                        docker build -t \${DOCKER_IMAGE} .

                        echo "4. Pushing Docker image to ACR"
                        docker push \${DOCKER_IMAGE}
                    """
                }
            }
        }
        
        stage('Deploy Container to Azure') {
            steps {
                # We use the same 'withCredentials' block to keep the Azure login context active
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        echo "5. Deploying new image to Azure App Service: \${AZ_APP_NAME}"
                        az webapp config container set \\
                            --resource-group \${AZ_RESOURCE_GROUP} \\
                            --name \${AZ_APP_NAME} \\
                            --docker-custom-image-name \${DOCKER_IMAGE} \\
                            --enable-cd true \\
                            --deployment-container-registry-server \${ACR_REGISTRY}
                            
                        echo "Deployment command sent. Azure will now pull the new image: \${DOCKER_IMAGE}"
                    """
                }
            }
        }
    }
}
