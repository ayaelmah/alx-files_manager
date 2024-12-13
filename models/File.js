import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['folder', 'image', 'file'],
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        default: 0
    }
    localPath: {
        type: String,
        default: null
    },
}, { timestamps: true });

const File = mongoose.model('File', FileSchema);

export default File;
