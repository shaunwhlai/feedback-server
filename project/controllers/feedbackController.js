const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Feedback = mongoose.model('Feedback');

router.get('/', (req, res) => {
    res.render("feedback/addOrEdit", {
        viewTitle: "Insert Feedback"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var feedback = new Feedback();
    feedback.fullName = req.body.fullName;
    feedback.email = req.body.email;
    feedback.mobile = req.body.mobile;
    feedback.city = req.body.city;
    feedback.comment = req.body.comment;
    feedback.save((err, doc) => {
        if (!err)
            res.redirect('feedback/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("feedback/addOrEdit", {
                    viewTitle: "Insert Feedback",
                    feedback: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Feedback.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('feedback/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("feedback/addOrEdit", {
                    viewTitle: 'Update Feedback',
                    feedback: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Feedback.find((err, docs) => {
        if (!err) {
            res.render("feedback/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving feedback list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Feedback.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("feedback/addOrEdit", {
                viewTitle: "Update Feedback",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Feedback.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/feedback/list');
        }
        else { console.log('Error in feedback delete :' + err); }
    });
});

module.exports = router;