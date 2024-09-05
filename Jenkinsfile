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
        stage('Contrôle qualité') {
            steps {
                sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=Back-end \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000 \
                    -Dsonar.token=sqp_5df442aff8fc7daa3ba1d15745a7ef9af778aa5d
                '''
            }
        }
    }
}
 