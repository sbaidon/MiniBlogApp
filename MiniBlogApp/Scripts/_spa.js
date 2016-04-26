var app = angular.module("spa", ['ngResource', 'ngRoute','ngSanitize']);


app.factory('categoryService', function ($resource) {
    return $resource('/api/Categories/:id',
        { id: '@Id' },
        {
            update: { method: 'PUT' }
        });
});

app.factory('pageService', function ($resource) {
    return $resource('/api/Pages/:id',
        { id: '@Id' },
        {
            update: { method: 'PUT' }
        });
});

app.controller("mainController", function ($sce, $scope, pageService) {


    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();

  
    pageService.query($scope.parseContent);
    
    $scope.parseContent = function (pages) {
        $scope.pages = pages.map(function(page) {
            var parsed = reader.parse(page.Content);
            page.Content = writer.render(parsed);
            return page;
        });
    };

});


app.controller("categoryController", function ($scope, categoryService) {

    $scope.errors = [];
    $scope.title = '';

    $scope.categories = categoryService.query();

    $scope.category = {
        Id: 0,
        Name: ''
    };

    $scope.deleteCategory = function (category) {
        categoryService.remove(category, $scope.refreshData, $scope.errorMessage);
    };

    $scope.saveCategory = function (category) {
        if ($scope.category.Id > 0) {
            categoryService.update($scope.category, $scope.refreshData, $scope.errorMessage);
        }
        else {
            categoryService.save($scope.category, $scope.refreshData, $scope.errorMessage);
            $scope.clearCurrentCategory();
        }
    };

    $scope.refreshData = function () {
        $scope.categories = categoryService.query();
        $("#modal-dialog").modal('hide');
    };

    $scope.showAddDialog = function () {
        $scope.errors = [];
        $scope.clearCurrentCategory();
        $scope.title = 'Add Category';
        $("#modal-dialog").modal('show');

    };

    $scope.showUpdateDialog = function () {
        $scope.errors = [];
        $scope.title = 'Update department';
        $("#modal-dialog").modal('show');
    };


    $scope.clearCurrentCategory = function () {
        $scope.category = {
            Id: 0,
            Name: ''
        };
    };

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

    $scope.selectCategory = function (category) {
        $scope.category = category;
        $scope.showUpdateDialog();
    };

});

app.controller("pageController", function ($scope, pageService, categoryService) {

    $scope.errors = [];
    $scope.title = '';

    $scope.pages = pageService.query();

    $scope.categories = categoryService.query();


    $scope.page = {
        Id: 0,
        Name: '',
        Title: '',
        Date: '',
        Content:'',
        Author: '',
        CategoryId:0
    };

    $scope.deletePage = function (page) {
        pageService.remove(page, $scope.refreshData, $scope.errorMessage);
    };

    $scope.refreshData = function () {
        $scope.pages = pageService.query();
        $("#modal-dialog").modal('hide');
    };

    $scope.showAddDialog = function () {
        $scope.errors = [];
        $scope.title = 'Add Page';
        $scope.clearCurrentPage();
        $("#modal-dialog").modal('show');

    };

    $scope.showUpdateDialog = function () {
        $scope.errors = [];
        $scope.title = 'Update Page';
        $("#modal-dialog").modal('show');
    };

    $scope.savePage = function () {
        if ($scope.page.Id > 0) {
            pageService.update($scope.page, $scope.refreshData, $scope.errorMessage)
        }
        else {
            pageService.save($scope.page, $scope.refreshData, $scope.errorMessage)
            $scope.clearCurrentPage();
        };

    };

    $scope.viewContent = function () {
        $("#modal-dialog").modal('hide');
        $("#modal-content").modal('show');
        var reader = new commonmark.Parser();
        var writer = new commonmark.HtmlRenderer();
        var parsed = reader.parse($scope.page.Content);
        $scope.commonMark = writer.render(parsed);
        
    };

    $scope.selectPage = function (page) {
        page.Date = new Date(page.Date);
        $scope.page = page;
        $scope.showUpdateDialog();
    };

    $scope.clearCurrentPage = function () {
        $scope.page = {
            Id: 0,
            Name: '',
            Title: '',
            Date: '',
            Content: '',
            Author: '',
            CategoryId: 0
        };

    };

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'mainController',
            templateUrl:"/Content/Views/Content.html"
        }).when('/categories', {
            templateUrl: "/Content/Views/Categories.html",
            controller: "categoryController"
        }).when('/pages', {
            templateUrl: "/Content/Views/Pages.html",
            controller: "pageController"
        });
});