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
                        # All dollar signs used by the shell must now be escaped (\$ instead of $)

                        # Extract APP_ID
                        APP_ID=\$(echo \$AZURE_AUTH_JSON | grep -o '"clientId": *"[^"]*"' | awk -F'"' '{print \$4}')
                        
                        # Extract SECRET
                        SECRET=\$(echo \$AZURE_AUTH_JSON | grep -o '"clientSecret": *"[^"]*"' | awk -F'"' '{print \$4}')
                        
                        # Extract TENANT_ID
                        TENANT_ID=\$(echo \$AZURE_AUTH_JSON | grep -o '"tenantId": *"[^"]*"' | awk -F'"' '{print \$4}')

                        echo "Attempting to log in to Azure..."

                        # Use the extracted values for Service Principal login
                        az login --service-principal -u \$APP_ID -p \$SECRET --tenant \$TENANT_ID

                        # 2. Deploy the zipped artifact to your App Service
                        az webapp deployment source config-zip \\
                            --resource-group rg-nextjs-cicd \\
                            --name app-nextjs-ci-cd-ygwd \\ 
                            --src nextjs.zip \\
                            --build-remote false
                    """
                }
            }
        }
    }
}
