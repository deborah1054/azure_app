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
                // AZURE_AUTH_JSON holds the Service Principal JSON as a string
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        # We use simple string parsing (grep, awk) to extract the needed values
                        # This avoids the dependency on 'jq'.
                        
                        APP_ID=$(echo \$AZURE_AUTH_JSON | grep -o '"clientId": *"[^"]*"' | awk -F'"' '{print \$4}')
                        SECRET=$(echo \$AZURE_AUTH_JSON | grep -o '"clientSecret": *"[^"]*"' | awk -F'"' '{print \$4}')
                        TENANT_ID=$(echo \$AZURE_AUTH_JSON | grep -o '"tenantId": *"[^"]*"' | awk -F'"' '{print \$4}')

                        echo "Attempting to log in to Azure..."

                        # Use the extracted values for a reliable Service Principal login
                        az login --service-principal -u \$APP_ID -p \$SECRET --tenant \$TENANT_ID

                        # 2. Deploy the zipped artifact to your App Service
                        az webapp deployment source config-zip \\
                            --resource-group rg-nextjs-cicd \\
                            --name app-nextjs-ci-cd-ygwd \\ 
                            --src nextjs.zip \\
                            --build-remote false
                        
                        # No local files to clean up anymore!
                    """
                }
            }
        }
    }
}
