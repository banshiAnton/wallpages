(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/admin/add-category/add-category.component.css":
/*!***************************************************************!*\
  !*** ./src/app/admin/add-category/add-category.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/admin/add-category/add-category.component.html":
/*!****************************************************************!*\
  !*** ./src/app/admin/add-category/add-category.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n    <div class=\"form-group\">\n        <label>Имя категории</label>\n        <input type=\"text\" [(ngModel)]=\"addName\" class=\"form-control\" placeholder=\"Имя категории\">\n    </div>\n    <div class=\"form-group\">\n        <label>Теги категории</label>\n        <tag-input [(ngModel)]=\"tags\" [separatorKeys]=\"[' ']\"></tag-input>\n    </div>\n    <button type=\"submit\" (click)=\"onAdd()\" class=\"btn btn-primary\">Добавить Категорию</button>\n</div>\n\n<div>\n    <div class=\"form-group\">\n        <label>Выберите категорию</label>\n        <select class=\"form-control\" (change)=\"onSelect(categ.value)\" #categ>\n          <option selected disabled>Choose category</option>\n          <option *ngFor=\"let category of categories\">{{category.name}}</option>\n        </select>\n    </div>\n    <div class=\"form-group\">\n        <label>Имя категории</label>\n        <input type=\"text\" [(ngModel)]=\"selected.name\" class=\"form-control\" placeholder=\"Имя категории\">\n    </div>\n    <div class=\"form-group\">\n      <label>Теги категории</label>\n      <tag-input [(ngModel)]=\"selected.tags\" [separatorKeys]=\"[' ']\"></tag-input>\n    </div>\n    <button type=\"button\" (click)=\"onUpdata()\" class=\"btn btn-primary\">Обновить категорию</button>\n</div>"

/***/ }),

/***/ "./src/app/admin/add-category/add-category.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/admin/add-category/add-category.component.ts ***!
  \**************************************************************/
/*! exports provided: AddCategoryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddCategoryComponent", function() { return AddCategoryComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/service.service */ "./src/app/services/service.service.ts");
/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tag */ "./src/app/admin/tag.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AddCategoryComponent = /** @class */ (function () {
    function AddCategoryComponent(service) {
        this.service = service;
        this.tags = [];
        this.categories = [];
        this.selected = { name: null, tags: [] };
    }
    AddCategoryComponent.prototype.ngOnInit = function () {
        this.getCaterories();
    };
    AddCategoryComponent.prototype.getCaterories = function () {
        var _this = this;
        this.service.getCategories().subscribe(function (data) {
            if (data.success) {
                _this.categories = data.categories.map(function (categ) {
                    categ.tags = categ.tags.map(function (tag) {
                        return new _tag__WEBPACK_IMPORTED_MODULE_2__["Tag"](tag, false);
                    });
                    return categ;
                });
            }
        });
    };
    AddCategoryComponent.prototype.onAdd = function () {
        console.log(this.tags, this.addName);
        this.service.addCategory(this.addName, this.tags.map(function (item) {
            return item.value;
        })).subscribe(function (data) {
            console.log(data);
            if (data.success)
                location.reload();
        });
    };
    AddCategoryComponent.prototype.onSelect = function (category) {
        console.log('Selected', category);
        this.selected = Object.assign({}, this.categories.find(function (categ) { return categ.name === category; }));
        console.log(this.selected);
    };
    AddCategoryComponent.prototype.onUpdata = function () {
        console.log('On updata', this.selected);
        this.service.updateCategory(this.selected).subscribe(function (data) {
            console.log(data);
            if (data.success) { } //location.reload();
        });
    };
    AddCategoryComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-category',
            template: __webpack_require__(/*! ./add-category.component.html */ "./src/app/admin/add-category/add-category.component.html"),
            styles: [__webpack_require__(/*! ./add-category.component.css */ "./src/app/admin/add-category/add-category.component.css")]
        }),
        __metadata("design:paramtypes", [_services_service_service__WEBPACK_IMPORTED_MODULE_1__["ServiceService"]])
    ], AddCategoryComponent);
    return AddCategoryComponent;
}());



/***/ }),

/***/ "./src/app/admin/add-images/add-images.component.css":
/*!***********************************************************!*\
  !*** ./src/app/admin/add-images/add-images.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\r\n    display: block;\r\n    padding-left: 1%;\r\n}\r\n\r\n.main-form {\r\n    padding: 1% 1% 1% 0;\r\n}"

/***/ }),

/***/ "./src/app/admin/add-images/add-images.component.html":
/*!************************************************************!*\
  !*** ./src/app/admin/add-images/add-images.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-form\">\n    <form enctype=\"application/x-www-form-urlencoded\" (submit)=\"onSubmit($event, form)\" #form>\n      <div class=\"form-check\">\n          <label class=\"form-check-label\">\n            <input class=\"form-check-input\" type=\"checkbox\" [(ngModel)]=\"inOne\" [ngModelOptions]=\"{standalone: true}\">\n              Загрузить всё в одну категорию ?\n          </label>\n      </div>\n      <div class=\"form-group\" *ngIf=\"inOne\">\n        <label>Выберите категорию</label>\n        <select class=\"form-control\" [(ngModel)]=\"oneCategory\" [ngModelOptions]=\"{standalone: true}\">\n          <option selected disabled>Choose category</option>\n          <option *ngFor=\"let category of categories\">{{category.name}}</option>\n        </select>\n      </div>\n      <div class=\"form-group\">\n        <input type=\"file\" class=\"form-control-file\" multiple name=\"images\" (change)=\"onChange(inputFiles)\" #inputFiles required>\n      </div>\n      <button type=\"submit\" class=\"btn btn-primary\">Post</button>\n    </form>\n  </div>\n  \n  <div>\n    <div *ngFor=\"let file of imagesList\">\n      <app-image-item [inOne]=\"{inOne: inOne, category: oneCategory}\" [categories]=\"categories\" [file]=\"file\" (selected)=\"onImgSelect($event)\"></app-image-item>\n    </div>\n  </div>\n"

/***/ }),

/***/ "./src/app/admin/add-images/add-images.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/admin/add-images/add-images.component.ts ***!
  \**********************************************************/
/*! exports provided: AddImagesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddImagesComponent", function() { return AddImagesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/service.service */ "./src/app/services/service.service.ts");
/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tag */ "./src/app/admin/tag.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AddImagesComponent = /** @class */ (function () {
    function AddImagesComponent(service) {
        var _this = this;
        this.service = service;
        this.imagesList = [];
        this.imageData = Object.create(null);
        this.service.getCategories().subscribe(function (data) {
            if (data.success) {
                _this.categories = data.categories.map(function (categ) {
                    categ.tags = categ.tags.map(function (tag) { return new _tag__WEBPACK_IMPORTED_MODULE_2__["Tag"](tag); });
                    return categ;
                });
            }
        });
    }
    AddImagesComponent.prototype.ngOnInit = function () {
    };
    AddImagesComponent.prototype.onSubmit = function (e, form) {
        var _this = this;
        e.preventDefault();
        var data = new FormData(form);
        if (this.inOne && this.oneCategory) {
            console.log(this.oneCategory);
            for (var image in this.imageData) {
                this.imageData[image]['category'] = this.categories.find(function (categ) { return categ.name === _this.oneCategory; }).id;
            }
        }
        ;
        for (var image in this.imageData) {
            console.log(this.imageData[image]['tags']);
            this.imageData[image]['tags'] = this.imageData[image]['tags'].map(function (tag) { return tag ? tag.value : ''; });
        } //this.imageData[image]['tags'] = this.imageData[image]['tags'].length ? this.imageData[image]['tags'].map(tag => tag.value) : [];
        data.append('filesData', JSON.stringify(this.imageData));
        this.service.postImages(data).subscribe(function (data) {
            console.log(data);
        });
    };
    AddImagesComponent.prototype.onChange = function (inputFiles) {
        var _this = this;
        this.imagesList = [];
        console.log(inputFiles.files); //FileReader
        var _loop_1 = function (file) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                _this.imagesList.push({ src: reader.result, fileName: file.name });
                _this.imageData[file.name] = Object.create(null);
                _this.imageData[file.name]['tags'] = [];
            }, false);
            reader.readAsDataURL(file);
        };
        for (var _i = 0, _a = inputFiles.files; _i < _a.length; _i++) {
            var file = _a[_i];
            _loop_1(file);
        }
    };
    AddImagesComponent.prototype.onImgSelect = function (e) {
        if (e.file && !this.imageData[e.file])
            this.imageData[e.file] = Object.assign(this.imageData[e.file] || {});
        if (e.tags)
            this.imageData[e.file]['tags'] = e.tags;
        console.log();
        if (e.category)
            this.imageData[e.file]['category'] = e.category;
    };
    AddImagesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-images',
            template: __webpack_require__(/*! ./add-images.component.html */ "./src/app/admin/add-images/add-images.component.html"),
            styles: [__webpack_require__(/*! ./add-images.component.css */ "./src/app/admin/add-images/add-images.component.css")]
        }),
        __metadata("design:paramtypes", [_services_service_service__WEBPACK_IMPORTED_MODULE_1__["ServiceService"]])
    ], AddImagesComponent);
    return AddImagesComponent;
}());



/***/ }),

/***/ "./src/app/admin/add-images/image-item/image-item.component.css":
/*!**********************************************************************!*\
  !*** ./src/app/admin/add-images/image-item/image-item.component.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".img-item {\r\n    padding: 1% 0 1% 1%;\r\n    border: 2px solid black;\r\n    border-radius: 15px;\r\n    margin-bottom: 1%;\r\n}\r\n\r\n.img-fluid {\r\n    max-width: 60%;\r\n}\r\n\r\n/* .img-item > p {\r\n    margin: 0;\r\n    padding: 10px 10px 10px 0;\r\n}\r\n\r\nselect {\r\n    \r\n} */"

/***/ }),

/***/ "./src/app/admin/add-images/image-item/image-item.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/admin/add-images/image-item/image-item.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"img-item row\">\n  <div class=\"col-3\">\n    <p>File name: {{file.fileName}}</p>\n    <img src=\"{{file.src}}\" alt=\"\" class=\"img-fluid\">\n  </div>\n  <div class=\"col-5 mr-auto\">\n    <div *ngIf=\"!inOne.inOne\">\n      <label>Выберите категорию</label>\n      <select class=\"form-control\" (change)=\"onSelect(category.value)\" #category>\n        <option selected disabled>Choose category</option>\n        <option *ngFor=\"let category of categories\">{{category.name}}</option>\n      </select>\n    </div>\n    <div>\n      <tag-input [(ngModel)]=\"tags\" [separatorKeys]=\"[' ']\" (onAdd)=\"onTagChange()\" (onRemove)=\"onTagChange()\"></tag-input>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/admin/add-images/image-item/image-item.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/admin/add-images/image-item/image-item.component.ts ***!
  \*********************************************************************/
/*! exports provided: ImageItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageItemComponent", function() { return ImageItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ImageItemComponent = /** @class */ (function () {
    function ImageItemComponent() {
        this.tags = [];
        this.selected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ImageItemComponent.prototype.ngOnChanges = function () {
        var _this = this;
        if (this.inOne.inOne && this.inOne.category) {
            this.tags = this.categories.find(function (categ) { return categ.name === _this.inOne.category; }).tags;
        }
        else {
            this.tags = [];
        }
    };
    ImageItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.inOne.inOne && this.inOne.category) {
            this.tags = this.categories.find(function (categ) { return categ.name === _this.inOne.category; }).tags;
        }
        else {
            this.tags = [];
        }
    };
    ImageItemComponent.prototype.onSelect = function (category) {
        this.tags = this.categories.find(function (categ) { return categ.name === category; }).tags;
        console.log('test select', { category: this.categories.find(function (categ) { return categ.name === category; }).id, file: this.file.fileName, tags: this.tags.filter(function (tag) { return !tag.readonly; }) });
        this.selected.emit({ category: this.categories.find(function (categ) { return categ.name === category; }).id, file: this.file.fileName, tags: this.tags.filter(function (tag) { return !tag.readonly; }) });
    };
    ImageItemComponent.prototype.onTagChange = function () {
        console.log('test tags input', { file: this.file.fileName, tags: this.tags.filter(function (tag) { return !tag.readonly; }) });
        this.selected.emit({ file: this.file.fileName, tags: this.tags.filter(function (tag) { return !tag.readonly; }) });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ImageItemComponent.prototype, "file", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ImageItemComponent.prototype, "inOne", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ImageItemComponent.prototype, "categories", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ImageItemComponent.prototype, "selected", void 0);
    ImageItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-image-item',
            template: __webpack_require__(/*! ./image-item.component.html */ "./src/app/admin/add-images/image-item/image-item.component.html"),
            styles: [__webpack_require__(/*! ./image-item.component.css */ "./src/app/admin/add-images/image-item/image-item.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ImageItemComponent);
    return ImageItemComponent;
}());



/***/ }),

/***/ "./src/app/admin/admin.component.css":
/*!*******************************************!*\
  !*** ./src/app/admin/admin.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/admin/admin.component.html":
/*!********************************************!*\
  !*** ./src/app/admin/admin.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!isAuth\">\n  Auth Form!\n</div>\n\n<div *ngIf=\"isAuth\">\n  <a routerLink=\"addCategoty\">Add Category</a><br>\n  <a routerLink=\"addImages\">Add Images</a>\n</div>"

/***/ }),

/***/ "./src/app/admin/admin.component.ts":
/*!******************************************!*\
  !*** ./src/app/admin/admin.component.ts ***!
  \******************************************/
/*! exports provided: AdminComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminComponent", function() { return AdminComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/service.service */ "./src/app/services/service.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdminComponent = /** @class */ (function () {
    function AdminComponent(service) {
        this.service = service;
        this.isAuth = true;
    }
    AdminComponent.prototype.ngOnInit = function () {
    };
    AdminComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-admin',
            template: __webpack_require__(/*! ./admin.component.html */ "./src/app/admin/admin.component.html"),
            styles: [__webpack_require__(/*! ./admin.component.css */ "./src/app/admin/admin.component.css")]
        }),
        __metadata("design:paramtypes", [_services_service_service__WEBPACK_IMPORTED_MODULE_1__["ServiceService"]])
    ], AdminComponent);
    return AdminComponent;
}());



/***/ }),

/***/ "./src/app/admin/tag.ts":
/*!******************************!*\
  !*** ./src/app/admin/tag.ts ***!
  \******************************/
/*! exports provided: Tag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tag", function() { return Tag; });
var Tag = /** @class */ (function () {
    function Tag(value, readonly) {
        if (readonly === void 0) { readonly = true; }
        this.value = value;
        this.display = value;
        this.readonly = readonly;
    }
    return Tag;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'client';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var ngx_chips__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-chips */ "./node_modules/ngx-chips/esm5/ngx-chips.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _admin_admin_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./admin/admin.component */ "./src/app/admin/admin.component.ts");
/* harmony import */ var _router_app_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./router/app-routing.module */ "./src/app/router/app-routing.module.ts");
/* harmony import */ var _admin_add_images_image_item_image_item_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./admin/add-images/image-item/image-item.component */ "./src/app/admin/add-images/image-item/image-item.component.ts");
/* harmony import */ var _admin_add_images_add_images_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./admin/add-images/add-images.component */ "./src/app/admin/add-images/add-images.component.ts");
/* harmony import */ var _admin_add_category_add_category_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./admin/add-category/add-category.component */ "./src/app/admin/add-category/add-category.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





 // this is needed!






var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"],
                _admin_admin_component__WEBPACK_IMPORTED_MODULE_7__["AdminComponent"],
                _admin_add_images_image_item_image_item_component__WEBPACK_IMPORTED_MODULE_9__["ImageItemComponent"],
                _admin_add_images_add_images_component__WEBPACK_IMPORTED_MODULE_10__["AddImagesComponent"],
                _admin_add_category_add_category_component__WEBPACK_IMPORTED_MODULE_11__["AddCategoryComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _router_app_routing_module__WEBPACK_IMPORTED_MODULE_8__["AppRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                ngx_chips__WEBPACK_IMPORTED_MODULE_4__["TagInputModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/router/app-routing.module.ts":
/*!**********************************************!*\
  !*** ./src/app/router/app-routing.module.ts ***!
  \**********************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _admin_admin_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../admin/admin.component */ "./src/app/admin/admin.component.ts");
/* harmony import */ var _admin_add_images_add_images_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../admin/add-images/add-images.component */ "./src/app/admin/add-images/add-images.component.ts");
/* harmony import */ var _admin_add_category_add_category_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../admin/add-category/add-category.component */ "./src/app/admin/add-category/add-category.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [
    { path: 'admin', component: _admin_admin_component__WEBPACK_IMPORTED_MODULE_2__["AdminComponent"] },
    { path: 'admin/addImages', component: _admin_add_images_add_images_component__WEBPACK_IMPORTED_MODULE_3__["AddImagesComponent"] },
    { path: 'admin/addCategoty', component: _admin_add_category_add_category_component__WEBPACK_IMPORTED_MODULE_4__["AddCategoryComponent"] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/services/service.service.ts":
/*!*********************************************!*\
  !*** ./src/app/services/service.service.ts ***!
  \*********************************************/
/*! exports provided: ServiceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceService", function() { return ServiceService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ServiceService = /** @class */ (function () {
    function ServiceService(http) {
        this.http = http;
        this.apiImageUrl = '/api.images/';
    }
    ServiceService.prototype.postImages = function (data) {
        console.log('service', data);
        return this.http.post(this.apiImageUrl + "upload", data, {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]()
        });
    };
    ServiceService.prototype.addCategory = function (name, tags) {
        console.log('Service', name, tags);
        return this.http.post(this.apiImageUrl + "add/category", JSON.stringify({ name: name, tags: tags }), {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({ 'Content-Type': 'application/json' })
        });
    };
    ServiceService.prototype.getCategories = function () {
        return this.http.get(this.apiImageUrl + "categories").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])(function (item) { return console.log('Resp', item); }));
    };
    ServiceService.prototype.updateCategory = function (category) {
        return this.http.put(this.apiImageUrl + "categories/" + category.id, JSON.stringify({ name: category.name, tags: category.tags.map(function (tag) { return tag.value; }) }), {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({ 'Content-Type': 'application/json' })
        });
    };
    ServiceService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], ServiceService);
    return ServiceService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\JS\wallpages\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map