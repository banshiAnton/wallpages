let parseFilesData = function (req, res, next) {
    req.body.filesData = JSON.parse(req.body.filesData);
    next();
}

let groupFileDataToFiles = function(req, res, next) {

    console.log(req.body.filesData, req.files);

    for(let file of req.files.images) {
        file.category = req.body.filesData[file.name].category;
        file.tags = req.body.filesData[file.name].tags;
        file.name = Date.now() + '_' + file.name;
        file.name.trim();
    }

    console.log('Transformed', req.files);

    next()
}

exports.groupFileDataToFiles = groupFileDataToFiles;
exports.parseFilesData = parseFilesData;