# smartPillBox
This is smart pillbox by ICSL. Author: Jinyang Yu
The goal of this project is to build a safe platform to securely upload file from patients to doctors. The smart pillbox is a subset of the platform which provides a way to render Electronical Medical Record(EMR) on doctor's web browser, and receives new schedule issued by the doctor.

The data transmission process is achieved by scanning QR code and http requests.
The application is written in node.js, and the website can be hosted through any web server, such as AWS ElasticBeanstalk, Heroku, or personal server.

As for now, we have implemented features including uploading files, render EMR, issue schedule.

### TODO
- Add database component (MongoDB)
- Change internal data routing from http routing to Session()

