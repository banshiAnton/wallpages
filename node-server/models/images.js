module.exports = (sequelize, DataTypes) => {
    return sequelize.define("images", {

        file: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                }
            }
        },

        tags: { type: DataTypes.STRING, allowNull: false, 
            set(tagsArr) {
                this.setDataValue('tags', tagsArr.join(' '))
            },
            get() {
                let geted = [];
                if (this.getDataValue('tags')) {
                    let raw = this.getDataValue('tags').split(' ');
                    for(let tag of raw) { if(tag) geted.push(tag) }
                }
                return geted;
            }
        },

        mimetype: { type: DataTypes.STRING, defaultValue: 'image/jpeg', allowNull: false },

        isPublish: { type: DataTypes.BOOLEAN, defaultValue: false },

    }, {
        getterMethods: {
            clientData() {
                return {
                    id: this.get('id'),
                    file: this.get('file'), 
                    tags: this.get('tags'),
                    category_id: this.get('category_id')
                }
            }
        }
    });
}