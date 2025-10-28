pipeline {
    agent any 
    
    tools {
        // Must match the name you set in your Jenkins Global Tool Configuration
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

        // *** NEW STAGE TO INSTALL UTILITIES ***
        stage('Install Utilities') {
            steps {
                echo 'Installing zip utility for packaging...'
                // Update package list and install the zip utility
                sh 'sudo apt-get update && sudo apt-get install -y zip'
            }
        }
        // **************************************
        
        stage('Package Artifacts') {
            steps {
                // Now that zip is installed, this command should succeed
                sh 'zip -r nextjs.zip .next public package.json package-lock.json next.config.js'
                
                archiveArtifacts artifacts: 'nextjs.zip' 
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        # 1. Log in to Azure using the Service Principal JSON
                        echo \$AZURE_AUTH_JSON > azureauth.json
                        az login --service-principal --user @azureauth.json
                        
                        # 2. Deploy the zipped artifact to your App Service
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
