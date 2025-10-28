pipeline {
    agent any 
    
    // Uses the tools configured in Manage Jenkins -> Tools
    tools {
        jdk 'OpenJDK_17'    // The name you gave your JDK configuration
        nodejs 'NodeJS_20_LTS' // The name you gave your NodeJS configuration
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                // Code checkout happens automatically based on the SCM settings
                echo "Code checked out from ${env.GIT_URL}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Installs packages from package.json
                sh 'npm install' 
            }
        }
        
        stage('Build Artifacts') {
            steps {
                // Runs the build script defined in your package.json
                sh 'npm run build' 
            }
        }
        
        // This stage is a placeholder for your deployment steps
        stage('Archive Artifacts') {
             steps {
                 archiveArtifacts artifacts: 'build/**' // Or dist/**, depending on your project's output folder
             }
        }
    }
}