pipeline {
    agent {
        label 'agent-node'
    }
 
    stages {
        stage('Clone') {
            steps {
                git branch: 'test', url: 'https://github.com/eva-dpr2004/Harmonia_Server.git'
            }
        }
        stage('Build') {
            steps {
                sh '''
                    npm install
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                    ./node_modules/.bin/jest
                '''
            }
        }
        stage('Contrôle qualité') {
            steps {
                sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=Back-end \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://172.20.0.4:9000 \
                    -Dsonar.token=sqp_5df442aff8fc7daa3ba1d15745a7ef9af778aa5d
                    -Dsonar.branch.name=test
                '''
            }
        }
    }
}
