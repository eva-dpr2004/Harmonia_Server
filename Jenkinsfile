pipeline {
    agent {
        label 'agent-node'
    }
 
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/eva-dpr2004/Harmonia_Server'
            }
        }
        stage('Build') {
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                    npm run test
                '''
            }
        }
    }
}
 