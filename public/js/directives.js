angular.module('atnowApp').directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover',
            'display': 'inline-block',
            'width': '200px',
            'height': '200px',
            'margin': '5px',
            'border-radius': '20px',
            'background-position': 'center center',
            'background-size': 'cover'
        });
    };
});

angular.module('atnowApp').directive('modalImg', function(){
    return function(scope, element, attrs){
        var url = attrs.modalImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover',
            'width': '75px',
            'height': '75px',
            'border-radius': '75px',
            'background-position': 'center center',
            'background-size': 'cover',
            'margin': 'auto'
        });
    };
})
