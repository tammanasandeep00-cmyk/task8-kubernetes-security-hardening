pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        BACKEND_IMAGE = 'sandeep00t/task9-backend'
        FRONTEND_IMAGE = 'sandeep00t/task9-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBE_NAMESPACE = 'task8'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Automated Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                '''
            }
        }

        stage('Docker Hub Login') {
            steps {
                sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | \
                    docker login -u "$DOCKERHUB_CREDENTIALS_USR" \
                    --password-stdin
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/backend \
                      backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                      -n ${KUBE_NAMESPACE}

                    kubectl set image deployment/frontend \
                      frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      -n ${KUBE_NAMESPACE}
                '''
            }
        }

        stage('Verify Rollout') {
            steps {
                sh '''
                    kubectl rollout status deployment/backend \
                      -n ${KUBE_NAMESPACE} --timeout=120s

                    kubectl rollout status deployment/frontend \
                      -n ${KUBE_NAMESPACE} --timeout=120s
                '''
            }
        }

        stage('Application Validation') {
            steps {
                sh '''
                    kubectl get pods -n ${KUBE_NAMESPACE}

                    curl -fsS http://localhost:30080/api/health

                    curl -fsS http://localhost:30080/api/tasks
                '''
            }
        }
    }

    post {
        success {
            echo 'TASK 9 CI/CD PIPELINE COMPLETED SUCCESSFULLY'
        }

        failure {
            echo 'PIPELINE FAILED - CHECK THE FAILED STAGE'
        }

        always {
            sh 'docker logout || true'
        }
    }
}
