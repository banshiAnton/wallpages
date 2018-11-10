let categoryGetRes = function(seqRes, cb) {
    let res = {};
    res.count = seqRes.count;
    res.categories = seqRes.rows.map(category => {
        return {
            id: category.get('id'),
            name: category.get('name'), 
            tags: category.get('tags').map((item) => {
                return {
                    display: item,
                    value: item,
                    readonly: true
                }
            })
        }
    });
    res.success = true;
    cb(res);
}

exports.categoryGetRes = categoryGetRes;