pipeline {
    agent any 
    
    // ONLY KEEP tools that Jenkins natively recognizes, like 'jdk'.
    // Remove the 'nodejs' line entirely.
    tools {
        jdk 'OpenJDK_17'    // The name you gave your JDK configuration
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo "Code checked out from ${env.GIT_URL}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Since Node.js is installed directly on the VM (in the system PATH),
                // the 'sh' step can call 'npm' directly without the tools block.
                sh 'npm install' 
            }
        }
        
        stage('Build Artifacts') {
            steps {
                sh 'npm run build' 
            }
        }
        
        stage('Archive Artifacts') {
             steps {
                 // Adjust the folder name as needed (e.g., dist/** or build/**)
                 archiveArtifacts artifacts: 'build/**' 
             }
        }
    }
}