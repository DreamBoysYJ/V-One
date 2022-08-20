import multer from "multer";



export const localsMiddleware = (req,res,next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "V-ONE";
    res.locals.loggedInUser = req.session.user || {};

    next();
};

export const protectorMiddleware = (req,res,next) => {
    if(req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "로그인 후 이용하세요!")
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "Not Authorized")
        return res.redirect("/");
    }
};

export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
});

export const certificationsUpload = multer({
    dest: "uploads/certifications/",
    
})
