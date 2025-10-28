pipeline {
    agent any 
    
    tools {
        // This must match the name of the JDK you configured in Jenkins
        jdk 'OpenJDK_17' 
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo "Code checked out from ${env.GIT_URL}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install' 
            }
        }
        
        stage('Build Artifacts') {
            steps {
                sh 'npm run build' 
            }
        }
        
        // This stage will now succeed because the 'zip' utility was installed manually on the VM
        stage('Package Artifacts') {
            steps {
                // Creates a nextjs.zip archive with everything needed for Azure App Service
                sh 'zip -r nextjs.zip .next public package.json package-lock.json next.config.js'
                
                archiveArtifacts artifacts: 'nextjs.zip' 
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                // AZURE_SP_CREDENTIALS is the Credentials ID you set in Jenkins
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        # 1. Log in to Azure using the Service Principal JSON
                        echo \$AZURE_AUTH_JSON > azureauth.json
                        az login --service-principal --user @azureauth.json
                        
                        # 2. Deploy the zipped artifact to your App Service
                        # Using the identified App Service name: app-nextjs-ci-cd-ygwd
                        az webapp deployment source config-zip \\
                            --resource-group rg-nextjs-cicd \\
                            --name app-nextjs-ci-cd-ygwd \\ 
                            --src nextjs.zip \\
                            --build-remote false
                        
                        # Clean up the local auth file
                        rm azureauth.json
                    """
                }
            }
        }
    }
}
