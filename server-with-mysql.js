import { createApp } from './app.js'

// import { StudentModel } from './models/gRPC/student.js'
import { BulletinModel } from './models/gRPC/bulletin.js'

createApp({ bulletinModel: BulletinModel })
