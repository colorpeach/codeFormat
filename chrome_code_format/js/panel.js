angular
	.module("codeFormat",["fileOpera"])
	.controller("codeList",["$scope","fileUpdate",function($scope,fileUpdate){
		var storage = window.localStorage,
			nowIndex,
			toMap = function(list){
				var map = {};
				for(var i=0,len=list.length;i<len;i++){
					if(list[i].checked)
						map[list[i].source] = list[i].formatter;
				}
				return map;
			};
			///* 
		$scope.formatList = JSON.parse(storage.getItem("formatList"))||[];
		$scope.formatMap = toMap($scope.formatList);
		$scope.tab = "list";
		
		$scope.addFormat = function(){
			$scope.detail = {};
			$scope.tab = "detail";
			$scope.type = "add";
		};
		
		$scope.confirm = function(){
			$scope.tab = "list";
			if($scope.type === "add"){
				$scope.detail.checked = true;
				$scope.formatList.push($scope.detail);
			}else{
				$scope.formatList[nowIndex] = $scope.detail;
			}
			$scope.formatMap = toMap($scope.formatList);
			storage.setItem("formatList",JSON.stringify($scope.formatList));
		};
		
		$scope.editFormat = function(i){
			$scope.detail = $scope.formatList[i];
			nowIndex = i;
			$scope.tab = "detail";
			$scope.type = "edit";
		};
		
		$scope.cancel = function(){
			$scope.tab = "list";
		};
		
		$scope.removeFormat = function(i){
			$scope.formatList.splice(i,1);
			$scope.formatMap = toMap($scope.formatList);
			storage.setItem("formatList",JSON.stringify($scope.formatList));
		};
		
		$scope.checkFormat = function(i){
			var detail = $scope.formatList[i];
			detail.checked = !detail.checked;
			$scope.formatMap = toMap($scope.formatList);
			storage.setItem("formatList",JSON.stringify($scope.formatList));
		};
		
		fileUpdate($scope);
	}]);
