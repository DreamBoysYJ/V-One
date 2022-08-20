import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 4},
    fileUrl: {type: String, required: true},
    thumbUrl: {type: String, required: true},
    description: {type: String, required: true, minlength: 3},
    createdAt: {type: Date, required: true, default: Date.now},
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
});

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;