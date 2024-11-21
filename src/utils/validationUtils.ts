import { v2 as cloudinary } from 'cloudinary';
import Class from '../models/classModel';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// validate email format
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// validate password strength
export const isValidPassword = (password: string): boolean => {
    // Password should be at least 8 characters long and contain letters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

// validate if a name/string is not empty
export const isValidName = (name: string): boolean => {
    return name.trim().length > 0;
};

// validate Cloudinary URL 
export const isValidCloudinaryUrl = async (url: string): Promise<boolean> => {
    // validating the url
    const cloudinaryUrlPattern = new RegExp(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/.*`);
    if (!cloudinaryUrlPattern.test(url)) {
        return false;
    }

    // extracting the public ID
    const publicIdMatch = url.match(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/(.*)`);
    if (!publicIdMatch || publicIdMatch.length < 2) {
        return false;
    }
    const publicId = publicIdMatch[1];

    // checking if the image exists in my Cloudinary folder or not
    try {
        const result = await cloudinary.api.resource(publicId);
        return result && result.secure_url === url;
    } catch (error) {
        return false;
    }
};

// checking if the teacher is assigned to the class
export const isTeacherOfClass = async (teacherId: string, classId: string): Promise<boolean> => {
    const classData = await Class.findById(classId);
    return classData ? classData.teacherId.toString() === teacherId : false;
};