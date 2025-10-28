pipeline {
    agent any 
    
    tools {
        jdk 'OpenJDK_17' 
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
        
        stage('Package Artifacts') {
            steps {
                sh 'zip -r nextjs.zip .next public package.json package-lock.json next.config.js'
                archiveArtifacts artifacts: 'nextjs.zip' 
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        # Assign the sensitive JSON data to a simple shell variable for easy access
                        AZ_DATA='${AZURE_AUTH_JSON}'

                        # Extract Service Principal credentials using shell parsing
                        APP_ID=\$(echo \${AZ_DATA} | grep -o '"clientId": *"[^"]*"' | awk -F'"' '{print \$4}')
                        SECRET=\$(echo \${AZ_DATA} | grep -o '"clientSecret": *"[^"]*"' | awk -F'"' '{print \$4}')
                        TENANT_ID=\$(echo \${AZ_DATA} | grep -o '"tenantId": *"[^"]*"' | awk -F'"' '{print \$4}')

                        echo "Attempting to log in to Azure..."

                        # 1. Log in to Azure
                        az login --service-principal -u \${APP_ID} -p \${SECRET} --tenant \${TENANT_ID}

                        # 2. Deploy the zipped artifact (ALL ON ONE LINE to avoid continuation errors)
                        az webapp deployment source config-zip --resource-group rg-nextjs-cicd --name app-nextjs-ci-cd-ygwd --src nextjs.zip --build-remote false
                    """
                }
            }
        }
    }
}
