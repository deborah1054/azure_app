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
                // Jenkins automatically checks out the code, this stage confirms it.
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Since Node.js is installed directly on the VM (in the system PATH),
                // the 'sh' step can call 'npm' directly.
                sh 'npm install' 
            }
        }
        
        stage('Build Artifacts') {
            steps {
                // Creates the optimized production build in the .next directory
                sh 'npm run build' 
            }
        }
        
        stage('Package Artifacts') {
            steps {
                // Create a nextjs.zip archive containing all necessary files for deployment
                // We need the build output (.next), static assets (public), 
                // and configuration/dependencies (package.json, etc.)
                sh 'zip -r nextjs.zip .next public package.json package-lock.json next.config.js'
                
                // Archive the resulting zip file so it can be viewed in Jenkins
                archiveArtifacts artifacts: 'nextjs.zip' 
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                // Use the Service Principal credentials stored in Jenkins
                withCredentials([string(credentialsId: 'AZURE_SP_CREDENTIALS', variable: 'AZURE_AUTH_JSON')]) {
                    sh """
                        # 1. Log in to Azure using the Service Principal JSON
                        echo \$AZURE_AUTH_JSON > azureauth.json
                        az login --service-principal --user @azureauth.json
                        
                        # 2. Deploy the zipped artifact to your App Service
                        # Use the App Service name identified earlier: app-nextjs-ci-cd-ygwd
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
