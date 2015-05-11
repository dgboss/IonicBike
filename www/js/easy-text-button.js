/**
 * Created by boss on 5/8/2015.
 */

L.Control.EasyTextButtons = L.Control.extend({
    options: {
        position: 'bottomright',
        title: '',
        intentedIcon: 'fa-circle-o',
        label: '',
        extraClasses: 'cat'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control ' + this.options.extraClasses);

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
        this._addLabel();
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);
        this.link.title = this.options.title;

        return container;
    },

    intendedFunction: function(){ alert('no function selected');},

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.intendedFunction();
    },

    _addLabel: function () {
        var newSpan = L.DomUtil.create('span','',this.link);
        var newLabel = document.createTextNode(this.options.label);
        newSpan.appendChild(newLabel);

    },

    _addImage: function () {
        var extraClasses = this.options.intentedIcon.lastIndexOf('fa', 0) === 0 ? ' fa fa-lg' : ' glyphicon';

        L.DomUtil.create('i', this.options.intentedIcon + extraClasses, this.link);
    }
});

L.easyTextButton = function( btnIcon , btnFunction , btnTitle , btnMap, btnPosition, btnLabel, btnClasses ) {
    var newControl = new L.Control.EasyTextButtons;
    if (btnIcon) newControl.options.intentedIcon = btnIcon;

    if ( typeof btnFunction === 'function'){
        newControl.intendedFunction = btnFunction;
    }

    if (btnTitle) newControl.options.title = btnTitle;

    if (btnPosition) newControl.options.position = btnPosition;

    if (btnLabel) newControl.options.label = btnLabel;

    if(btnClasses) newControl.options.extraClasses = btnClasses;

    if ( btnMap == '' ){
        // skip auto addition
    } else if ( btnMap ) {
        btnMap.addControl(newControl);
    } else {
        map.addControl(newControl);
    }
    return newControl;
};
