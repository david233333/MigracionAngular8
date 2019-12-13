pipeline {
    agent any

    stages {
        stage('Build') {
			steps {
				sh 'whoami'
			  sh 'rm -rf dist/*'
			  sh 'rm -rf dist.zip'
				sh 'npm install'
				sh 'NODE_OPTIONS="--max-old-space-size=8192" npm run build '
				//sh 'docker run  --rm  -v "$PWD":/usr/src/app -w /usr/src/app node:9.11.1 chmod 777 -R .'
			}
        }

        stage('Test') {
            steps {
                //sh 'sh npm test'
				echo 'testing'
            }
        }

        stage('Archive Artifacts') {
            steps {
				sh 'zip -r dist.zip dist/'
				step([$class: 'ArtifactArchiver', artifacts: 'dist.zip', fingerprint: true])
            }
        }
        stage('Deploy') {
            steps {
				        sh 'firebase deploy --debug'
            }
        }
    }
}
