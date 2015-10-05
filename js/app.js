angular.module('task', [])
		.directive('requiredselect', function() {
			return {
				require: 'ngModel',
				link: function(scope, elm, attrs, ctrl) {
					ctrl.$validators.requiredselect = function(modelValue, viewValue) {
						return !!viewValue
					};
				}
			};
		})
		.controller('TaskController', ['$scope', '$filter', function ($scope, $filter) {
		window.scope = $scope;
		$scope.employees = {
			increment: localStorage.getItem('incr')|| 0,
			data: angular.fromJson(localStorage.getItem('emplData')) || [],
			order: 'id',
			odir: false
		};
		$scope.employee = {};
		$scope.dep = {};
		$scope.departments = [];


		$scope.addEmpl = function (empl) {
			var employees = $scope.employees.data;

			if(!$scope.formEmployee.$valid) {
				$scope.formInvalid = true;
				return;
			}

			if (typeof empl.id == 'undefined') {
				empl.id = $scope.employees.increment++;
				employees.push(angular.copy(empl))
			} else {
				var existingEmpl = $filter('filter')(employees, {id: empl.id})[0];
				var index = employees.indexOf(existingEmpl);
				employees[index] = angular.copy(empl);
			}

			localStorage.setItem('incr', $scope.employees.increment);
			localStorage.setItem('emplData', angular.toJson(employees));
			$scope.employee = {};
			$scope.formInvalid = false;
		};

		$scope.addDep = function (dep) {
			if (!dep.title) {
				dep.error = 'Empty department';
				return;
			}
			if ($scope.departments.indexOf(dep.title) >= 0) {
				dep.error = 'This department already exists';
				return;
			}
			$scope.departments.push(angular.copy(dep.title));
			$scope.employee.department = dep.title;
			$scope.dep = {};
		};

		$scope.edit = function (empl) {
			$scope.employee = angular.copy(empl);
		};

		$scope.remove = function (index) {

			$scope.employees.data.splice(index, 1);
			localStorage.setItem('emplData', angular.toJson($scope.employees.data));
		};

		$scope.order = function (order) {
			$scope.employees.odir = !$scope.employees.odir;
			$scope.employees.order = order;
		};
	}]);