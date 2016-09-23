'use strict';

angular.module('dashboardApp').controller('RequestManagementController', RequestManagementController);

RequestManagementController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'filterFilter', '$uibModal', 'RegistrationRequestService', 'ModalService', 'Utils'];

function RequestManagementController($scope, $rootScope, $state, $filter, filterFilter, $uibModal, RegistrationRequestService, ModalService, Utils){

	var requests = this;
	
	requests.listPending = listPending;
	requests.approveRequest = approveRequest;
	requests.rejectRequest = rejectRequest;
	requests.loadData = loadData;

	requests.list = [];
	requests.filtered = [];
	requests.sortType = 'creationTime';
	requests.sortReverse = true;
	requests.currentPage = 1;
	requests.maxSize = 5;
	requests.numPerPage = 10;

	// search
	requests.searchText = "";
	requests.resetFilters = resetFilters;
	requests.rebuildFilteredList = rebuildFilteredList;

	function resetFilters() {
		// needs to be a function or it won't trigger a $watch
		requests.searchText = "";
	}

	function rebuildFilteredList() {

		requests.filtered = filterFilter(requests.list, function(request) {

			if (!requests.searchText) {
				return true;
			}

			var query = requests.searchText.toLowerCase();
			
			if (request.familyname.toLowerCase().indexOf(query) != -1) {
				return true;
			}
			if (request.givenname.toLowerCase().indexOf(query) != -1) {
				return true;
			}
			if (request.username.toLowerCase().indexOf(query) != -1) {
				return true;
			}
			if (request.email.toLowerCase().indexOf(query) != -1) {
				return true;
			}
			if (request.notes.toLowerCase().indexOf(query) != -1) {
				return true;
			}
			return false;
		});
	}

	$scope.$watch('requests.searchText', function() {

		requests.rebuildFilteredList();
	});

	function loadData() {
		
		$rootScope.requestsLoadingProgress = 0;
		
		requests.loadingModal = $uibModal
		.open({
			animation: false,
			templateUrl : '/resources/iam/template/dashboard/requests/loading-modal.html'
		});

		requests.loadingModal.opened.then(function() {
		
			RegistrationRequestService.listPending().then(
				function(result) {
					requests.list = result.data;
					requests.rebuildFilteredList();
					$rootScope.requestsLoadingProgress = 100;
					$rootScope.loggedUser.pendingRequests = result.data;
					
					requests.loadingModal.dismiss("Cancel");
				},
				function(error) {

					$scope.operationResult = Utils.buildErrorOperationResult(error);
					requests.loadingModal.dismiss("Error");
				});
		});
	}

	function listPending() {
		RegistrationRequestService.listPending().then(
			function(result) {
				requests.list = result.data;
				requests.rebuildFilteredList();
				$rootScope.loggedUser.pendingRequests = result.data;
			},
			function(error) {
				$scope.operationResult = Utils.buildErrorOperationResult(error);
			})
	};

	function approveRequest(request) {
		RegistrationRequestService.updateRequest(request.uuid, 'APPROVED').then(
			function() {
				var msg = request.givenname + " " + request.familyname + " request APPROVED successfully";
				$scope.operationResult = Utils.buildSuccessOperationResult(msg);
				requests.listPending();
			},
			function(error) {
				$scope.operationResult = Utils.buildErrorOperationResult(error);
			})
	};

	function rejectRequest(request) {
		
		var modalOptions = {
			closeButtonText: 'Cancel',
            actionButtonText: 'Reject Request',
            headerText: 'Reject?',
            bodyText: `Are you sure you want to reject request for ${request.givenname} ${request.familyname}?`	
		};
		
		ModalService.showModal({}, modalOptions).then(
				function (){
					RegistrationRequestService.updateRequest(request.uuid, 'REJECTED').then(
							function() {
								var msg = request.givenname + " " + request.familyname + " request REJECTED successfully";
								$scope.operationResult = Utils.buildSuccessOperationResult(msg);
								requests.listPending();
							},
							function(error) {
								$scope.operationResult = Utils.buildErrorOperationResult(error);
							})
				});
	};
};
