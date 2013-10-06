var animation = require('alloy/animation');

//////////////////////////////////////////////
// About View

function changeView1() {
	changeView(1);
	open_tag_list();
}
function changeView2() {
	changeView(2);
}
function changeView3() {
	changeView(3);
	open_image_list();
}
function changeView4() {
	changeView(4);
    open_import_list();
}
function changeView5() {
	changeView(5);
}

function changeView(num) {
	var winNum = new Array(6);
	var buttonSize = new Array(6);
	for (var i = 1; i < 6; i++) {
		if(i == num) {
			winNum[i] = "true";
			buttonSize[i] = "60";
		} else {
			winNum[i] = "flase";
			buttonSize[i] = "50";
		}
	}
	$.tag_list.visible=winNum[1];
	$.album.visible=winNum[2];
	$.image_list.visible=winNum[3];
	$.import_container.visible=winNum[4];
	$.photo.visible=winNum[5];

	$.button1.height = buttonSize[1];
	$.button1.width = buttonSize[1];
	$.button2.height = buttonSize[2];
	$.button2.width = buttonSize[2];
	$.button3.height = buttonSize[3];
	$.button3.width = buttonSize[3];
	$.button4.height = buttonSize[4];
	$.button4.width = buttonSize[4];
	$.button5.height = buttonSize[5];
	$.button5.width = buttonSize[5];

	adjustSpace();
}

function adjustSpace() {
	var viewWidth = Titanium.Platform.displayCaps.platformWidth;
	var centerPoint = new Array(6);
	for(var i = 1; i < 6; i++) {
		centerPoint[i] = viewWidth*i/6;
	}
	$.button1.left = centerPoint[1] - $.button1.width/2;
	$.button2.left = centerPoint[2] - $.button2.width/2;
	$.button3.left = centerPoint[3] - $.button3.width/2;
	$.button4.left = centerPoint[4] - $.button4.width/2;
	$.button5.left = centerPoint[5] - $.button5.width/2;
}

changeView1();
adjustSpace();


animation.fadeOut($.tag_table, 0);
var IsTagTableVisible = 0;
var fadeInTagView = function(){
	if(IsTagTableVisible == 0) {
	 	animation.fadeIn($.tag_table, 500);
		$.tag_list.removeEventListener('click', fadeInTagView);
		IsTagTableVisible = 1;
	} else {
		IsTagTableVisible = 0;
	}
};
var fadeOutTagView = function(){
	animation.fadeOut($.tag_table, 500);
	$.tag_list.addEventListener('click', fadeInTagView);
};

$.tag_list.addEventListener('click', fadeInTagView);
$.close_tag.addEventListener('click', fadeOutTagView);


/////////////////////////////////////////////////
// About Controler
function save_tag_info(id, tag) {
    Ti.API.info("id:" + id + "  tag:" + tag);
    var tag_w = Alloy.createModel('image_tag', {
        'id': id,
        'tag': tag,
        'disabled': 0,
        'created_at': String(new Date().getTime()),
        'updated_at': String(new Date().getTime())
    });
    tag_w.save();
    alert('save tag info succeeded id:' + id + "  tag:" + tag);
}


function doClick() {
    alert("image clicked");
    Titanium.Media.openPhotoGallery({
        success: function () {},
        error: function (error) {},
        cancel: function() {},
        allowEditing: true,
        autohide: true,
        saveToPhotoGallery: true,
        animated: true,
        mediaTypes: [Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO],
        showControls: true
    });
}

function doClick2() {
	Titanium.Media.showCamera({
		success:function(event){

		},
		cancel:function(){

		},
		error:function(error){

		},
		saveToPhotoGallery:true,
		allowEditing:true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO],
	});
}

function get_image_seq() {
    var id;

    var seq_image_r = Alloy.createCollection('seq_image');
    seq_image_r.fetch();

    var seq_image_w
    if ( seq_image_r.length < 1 ) {
        seq_image_w = Alloy.createModel('seq_image', {"id" : 0});
        seq_image_w.save();
        seq_image_r = Alloy.createCollection('seq_image');
        seq_image_r.fetch();
    }

    seq_image_r.map(function(row) {
        id = row.get('id') + 1;
        row.set({'id':id});
        row.save();
    });
    return id;
}

function save_image_info(id) {
    var image_w = Alloy.createModel('image', {
        'id': id,
        'name': 'name' + id,
        'created_at': String(new Date().getTime())
    });
    image_w.save();

}
function read_image_info(id) {
    var image_r = Alloy.createCollection('image');

    if (id) {
        image_r.fetch({query: 'select * from image where id = ' + id});
    }
    else {
        image_r.fetch();
    }

    var images = new Array();
    image_r.map(function(image) {
        var image_id = image.get('id');
        var image_name = image.get('name');
        var image_created_at = image.get('created_at');
        images.push( image_id );
    });
    var images_str = images.join('/');

    var check_alert = Ti.UI.createAlertDialog({
           title: 'images',
           message: images_str,
           buttonNames: ['OK!', 'Cancel'],
           cancel: 1
    }); 
    check_alert.show();
}
function get_image_path_list(tags) {
    var image_r = Alloy.createCollection('image');

    if (tags) {
        tags_str = tags.join(',');
        image_r.fetch({query: 'select * from image where tag in (' + tag_str + ')'});
    }
    else {
        image_r.fetch();
    }

    var images = new Array();
    image_r.map(function(image) {
        var image_id = image.get('id');
        var image_name = image.get('name');
        var image_created_at = image.get('created_at');
        images.push( image_id );
    });
    return images;
    
}


function doClick3() {

    Titanium.Media.openPhotoGallery({
        success: function(event) {
            var id = get_image_seq();
            var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + id + '.png');
            var check_alert = Ti.UI.createAlertDialog({
                   title: 'photo save',
                   message: file,
                   buttonNames: ['OK!', 'Cancel'],
                   cancel: 1
            }); 
            check_alert.addEventListener('click', function(e){
                Ti.API.info(e.index);
            });
            check_alert.show();
            if (!file.exists()) {
                file.createFile();
            }
            file.write(event.media);

            save_image_info(id);

            file.read();
        },
        error: function(error) {
        },
        cancel: function() {
        },
        saveToPhotoGallery:false,
        allowEditing: true,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
    });
}

function doClick4() {
    var id;
    var rows = Alloy.createCollection('seq_image');
    rows.fetch();
    rows.map(function(row) {
        id = row.get('id');
    });

    read_image_info();

    var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + id + '.png');
    var win = Ti.UI.createWindow({
        backgroundColor: 'black'
    });
    var cancel_btn = Titanium.UI.createButton({title: 'close', height: 40, width: 100});
    cancel_btn.addEventListener('click', function() {
        win.close();
    });
    win.rightNavButton = cancel_btn;

    var view = Ti.UI.createView();

    var image = Ti.UI.createImageView({
        image: file,
        width: 200,
    });

    view.add(image);
    win.add(view);
    win.open({
        modal:true,
        modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLEFLIP_HORIZONTAL,
        modalStyle: Titanium.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
}

function doClick5() {
    var data  = [];
    var image_ids = get_image_path_list();

    var perRow = 4;
    var cellWidth = Titanium.Platform.displayCaps.platformWidth / perRow;
    var cellHeight = cellWidth;

    var row;
    for ( var i = 0, max = image_ids.length; i < max; i++ ) {
        if ( i === 0 || i % perRow === 0 ) {
            if ( i > 0 )  {
                data.push(row);
            }
            row = Titanium.UI.createTableViewRow({height: cellHeight});
            var rowView = Titanium.UI.createView({
                layout: 'horizontal',
                width: Titanium.UI.FILL,
            height: cellHeight
            });
            row.add(rowView);
        }
        var image = Titanium.UI.createImageView({
            image: Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + image_ids[i] + '.png'),
            width: cellWidth,
            height: cellHeight,
            bubbleParent: false
        });

        image.addEventListener('click', function(event){

            var image_win = Ti.UI.createWindow({
                backgroundColor: 'white'
            });
            var image_win_cancel_btn = Titanium.UI.createButton({title: 'close', height: 40, width: 100});
            image_win_cancel_btn.addEventListener('click', function() {
                image_win.close();
            });
            var image_view = Ti.UI.createView();
            var focused_image = Ti.UI.createImageView({
                image: file,
                width: 200,
            });
            image_view.add(focused_image);
            image_win.add(image_view);

            image_win.rightNavButton = image_win_cancel_btn;
            image_win.add(table);
            image_win.open({
                modal:true,
                modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLEFLIP_HORIZONTAL,
                modalStyle: Titanium.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
            });
        });

        rowView.add(image);
    }
    data.push(row);
    var table = Titanium.UI.createTableView({
        data:data,
        width: Titanium.UI.FILL
    });
    var win = Ti.UI.createWindow({
        backgroundColor: 'black'
    });
    var cancel_btn = Titanium.UI.createButton({title: 'close', height: 40, width: 100});
    cancel_btn.addEventListener('click', function() {
        win.close();
    });
    win.rightNavButton = cancel_btn;
    win.add(table);
    win.open({
        modal:true,
        modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLEFLIP_HORIZONTAL,
        modalStyle: Titanium.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
}

function create_image_list() {
    var data  = [];
    var image_ids = get_image_path_list();

    var perRow = 4;
    var cellWidth = Titanium.Platform.displayCaps.platformWidth / perRow;
    var cellHeight = cellWidth;

    var scrollView = Ti.UI.createScrollView({
        contentWidth: Ti.Platform.displayCaps.platformWidth,
        contentHeight: 'auto',
        layout: 'horizontal',
        scrollType: 'vertical',
        cancelBubble: true
    });
    Ti.API.info("image_ids.length : " + image_ids.length);

    var row;
    for ( var i = 0, max = image_ids.length; i < max; i++ ) {
        var image = Titanium.UI.createImageView({
            image: Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + image_ids[i] + '.png'),
            width: cellWidth,
            height: cellHeight,
            bubbleParent: false,
            cancelBubble: true,
            ext: {
                image: Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + image_ids[i] + '.png'),
                id: image_ids[i]
            }
        });

        image.addEventListener('click', function(e){
            var image_id = e.source.ext.id;

            var image_win = Ti.UI.createWindow({
                backgroundColor: 'white'
            });
            var image_win_cancel_btn = Titanium.UI.createButton({title: 'close', height: 40, width: 100});
            image_win_cancel_btn.addEventListener('click', function() {
                image_win.close();
            });
            var image_view = Ti.UI.createView();
            var inner_view = Ti.UI.createView();
            var focused_image = Ti.UI.createImageView({
                image: e.source.ext.image, 
                top: 0,
                right: 0,
                width: "100%",
                ext: {
                    id: image_id
                },
                layout: 'absolute'
            });

            var tags = ['smile', 'sleep', 'angry', 'laugh', 'eat', 'cry'];
            var tag_set_view = Ti.UI.createView({
                backgroundColor: 'blue',
                opacity: 0.8,
                bottom: 0,
                height: 144
            });
            var tag_set = Titanium.UI.createScrollView({
                    top: 10 + "dp",
                    left : 0 + "dp",
                    contentHeight : 100 + "dp",
                    height : 100 + "dp",
                    width : "100%",
                    contentWidth : (100 * tags.length) + "dp",
                    scrollType : "horizontal",
                    backgroundColor : "black",
            });
            for (var i = 0; i < tags.length; i++) {
                var v = Ti.UI.createView({
                    backgroundColor: "#ffffff",
                    borderWidth: 1,
                    top: "0dp",
                    height: "100dp",
                    ext: {
                        tag: tags[i]
                    }
                });
                v.left  = i * 100 + "dp";
                v.width = 100 + "dp";
                var label = Ti.UI.createLabel({
                    color: "#000",
                    font: {
                        fontSize: "14dp"
                    },
                    width: '90dp',
                    textAlign: 'center',
                    height: '90dp',
                    backgroundColor: "#ddd",
                    bubbleParent: true,
                });
                label.text = tags[i];
                label.name = tags[i];

                v.addEventListener('click', function(){
                    Ti.API.info(this.ext);
                    save_tag_info(image_id, this.ext.tag);
                    set_tag_mini_icon(image_id, inner_view);
                });
                v.add(label);
                tag_set.add(v);
            }
            tag_set_view.add(tag_set);

            tag_set_view.hide();
            focused_image.addEventListener('click', function(e){
                if (tag_set_view.visible) {
                    tag_set_view.hide();
                } else {
                    tag_set_view.show();
                }
//                var dialog = Ti.UI.createAlertDialog({
//                    title: "select tag",
//                    message: "please choose a tag",
//                    buttonNames: ['mariko','kojiharu', 'hoge', 'cancel'],
//                    cancel: 3,
//                    ext: {
//                        id: e.source.ext.id
//                    }
//                });
//                dialog.addEventListener('click', function(e) {
//                    Ti.API.info(e.index);
//                    var id = e.source.ext.id;
//                    var tag;
//                    if (e.index == 0) {
//                        tag = 'mariko';
//                        save_tag_info(id, tag);
//                    }
//                    if (e.index == 1) {
//                        tag = 'kojiharu';
//                        save_tag_info(id, tag);
//                    }
//                    if (e.index == 2) {
//                        tag = 'hoge';
//                        save_tag_info(id, tag);
//                    }
//                    if (e.cancel) {
//                        Ti.API.info("canceled");
//                        return;
//                    }
//                });
//                dialog.show();
            });

            inner_view.add(focused_image);
            set_tag_mini_icon(image_id, inner_view);
            image_view.add(inner_view);
            image_win.add(image_view);
            image_win.add(tag_set_view);
            
            // tool bar
            var flexSpace = Ti.UI.createButton({
                systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
            });
            var buttonBack = Ti.UI.createButton({
                title: String.fromCharCode(0x25c0)
            });
            var buttonForward = Ti.UI.createButton({
                title: String.fromCharCode(0x25b6)
            });
            image_win.setToolbar([flexSpace, buttonBack, flexSpace, buttonForward, flexSpace]);

            image_win.rightNavButton = image_win_cancel_btn;
            image_win.open({
                modal:true,
                modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLEFLIP_HORIZONTAL,
                modalStyle: Titanium.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
            });
            tag_set_view.show();
        });
        scrollView.add(image);
    }

//    var win = Ti.UI.createWindow({
//        backgroundColor: 'black'
//    });
    $.image_list.add(scrollView);
}

function get_tag_groups(tag) {
    var tag_r = Alloy.createCollection('image_tag');

    if (tag) {
        tag_r.fetch({query: 'select * from image_tag where tag is not null and id is not null and disabled = 0 and tag = ' + '"' + tag + '"'});
    }
    else {
        tag_r.fetch({query: 'select * from image_tag where tag is not null and id is not null and disabled = 0'});
    }

    var tags = new Array();
    tag_r.map(function(image) {
        var image_id = image.get('id');
        var tag = image.get('tag');
        
        if ( ! tags[tag] ) {
            tags[tag] = new Array();
        }

        tags[tag].push(image_id);
    });
    return tags;
}

function create_tag_list(tag) {
    var tag_win = $.tag_list;

    var tags = get_tag_groups();
    
    var perRow = 4;
    var cellWidth = Titanium.Platform.displayCaps.platformWidth / perRow;
    var cellHeight = cellWidth;

    var scrollView = Ti.UI.createScrollView({
        contentWidth: Ti.Platform.displayCaps.platformWidth,
        contentHeight: 'auto',
        layout: 'horizontal',
        scrollType: 'vertical',
        cancelBubble: true
    });
    
    var row;
    //for ( var i = 0, max = image_ids.length; i < max; i++ ) {
    for (var t in tags) {
        var length = tags[t].length - 1;
        Ti.API.info("length:" + length);
        var latest_id = tags[t][length];
        Ti.API.info("latest_id:" + latest_id);
        var image = Titanium.UI.createImageView({
            image: Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + latest_id + '.png'),
            width: cellWidth,
            height: cellHeight,
            bubbleParent: false,
            cancelBubble: true,
            ext: {
                tag: t,
            }
        });

        image.addEventListener('click', function(e){
            var scrollView = Ti.UI.createScrollView({
                contentWidth: Ti.Platform.displayCaps.platformWidth,
                contentHeight: 'auto',
                layout: 'horizontal',
                scrollType: 'vertical',
                cancelBubble: true
            });

            var tag = e.source.ext.tag;
            var tags = get_tag_groups(tag);

            for (var i = 0; i < tags[tag].length; i++) {
                var id = tags[tag][i];
                var image = Titanium.UI.createImageView({
                    image: Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + "/" + id + '.png'),
                    width: cellWidth,
                    height: cellHeight,
                    bubbleParent: false,
                    cancelBubble: true,
                    ext: {
                        id: id,
                    }
                });
                // set addEventLister for image
                scrollView.add(image);
            }
            var win = Ti.UI.createWindow({
                backgroundColor: 'black'
            });
            var cancel_btn = Titanium.UI.createButton({title: 'close', height: 40, width: 100});
            cancel_btn.addEventListener('click', function() {
                win.close();
            });
            win.rightNavButton = cancel_btn;
            win.add(scrollView);
            win.open({
                modal:true,
                modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLEFLIP_HORIZONTAL,
                modalStyle: Titanium.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
            });
        });
        scrollView.add(image);
    }
    tag_win.add(scrollView);
}

function open_tag_list() {

    var tags = get_tag_groups();
	var tag_num = tags.length;
	
	var hostScrollView = Titanium.UI.createScrollView({
		top             : "0dp",
		left            : "0dp",
		contentWidth    : "100dp",
		height          : "100%",
		width           : "100%",
		contentHeight   : "auto",
		scrollType      : "vertical",
		backgroundColor : "red",
	});
	
    var tag_count = 0;
	for (var tag_name in tags) {
		// Tag View
		var guestTagView = Ti.UI.createView({
			backgroundColor : "#ffffff",
			borderWidth : 1,
			top : (150 * tag_count) + "dp",
			height : "50dp",
			width: "100%",
		});
		var guestTagLabel = Ti.UI.createLabel({
			color : "#000",
			font : {
				fontSize : "14dp"
			},
			text: tag_name,
			width : "100%",
			textAlign : "center",
			height : "50dp",
			backgroundColor : "#ddd"
		});
		guestTagView.add(guestTagLabel);
		// Images View
		var guestScrollView = Titanium.UI.createScrollView({
			top : (150 * tag_count + 50) + "dp",
			left : "0dp",
			contentHeight : "100dp",
			height : "100dp",
			width : "100%",
			contentWidth : (100 * tags[tag_name].length) + "dp",
			scrollType : "horizontal",
			backgroundColor : "blue",
		});

		for(var j = 0; j < tags[tag_name].length; j++) {
			var imageListView = Ti.UI.createView({
				backgroundColor : "#ffffff",
				borderWidth : 10,
				top : "0dp",
				height : "100dp"
			});
			imageListView.left = (j * 100) + "dp";
			imageListView.width = 100 + "dp";

            var image_id = tags[tag_name][j];
			var imageListImageView = Ti.UI.createImageView({
                image: Titanium.Filesystem.applicationDataDirectory + '/' + image_id + '.png'
			});
			imageListView.add(imageListImageView);
			imageListImageView.addEventListener('click', function(){
				var imageListBigImageBackView = Ti.UI.createView({
					backgroundImage: "/tag_table_back.png",
					width:"100%",
					height:"100%",
				});
				var imageListBigImageView = Ti.UI.createImageView({
					image: this.image,
					width: "90%",
					height: "90%",
				});
				imageListBigImageBackView.add(imageListBigImageView);
				imageListBigImageBackView.addEventListener('click', function(){
					animation.fadeOut(this, 500);
//					$.tag_list.remove(this);
				});
				$.tag_list.add(imageListBigImageBackView);
			});
			guestScrollView.add(imageListView);
		}
		hostScrollView.add(guestTagView);
		hostScrollView.add(guestScrollView);

        tag_count = tag_count + 1;
	}
	$.tag_list.add(hostScrollView);
};

function open_image_list() {
    var children = $.image_list.children.slice(0);
    if (children) {
        for (var i = 0; i < children.length; i++) {
            Ti.API.info("remove children");
            $.image_list.remove(children[i]);
        }
    }
    create_image_list();
}

function open_import_list() {

    var previous_views = $.import_container.children.slice(0);
    for (var i = 0; i < previous_views.length; i++) {
        $.import_container.remove(previous_views[i]);
    }
    
    var view = Ti.UI.createScrollView({
        contentWidth: Ti.Platform.displayCaps.platformWidth,
        contentHeight: 'auto',
        layout: 'horizontal',
        scrollType: 'vertical',
        cancelBubble: true,
        top: 50 + 'dp'
    });
    var assetslibrary = require('ti.assetslibrary');
    var g = [assetslibrary.AssetsGroupTypeAll];
    assetslibrary.getGroups(g, function(e) {
        var list = e.groups;
        for (var i = 0; i < list.length; i++) {
            var ao = list[i];
            Ti.API.info(ao.name);
            ao.getAssets(function(e) {
                var al = e.assets;
                var length = al.assetsCount;
                if (length < 1) {
                    return;
                }
                Ti.API.info("length : " + length);
                for (var i = 0; i < length; i++) {
                    var o = al.getAssetAtIndex(i);

                    var perRow = 4;
                    var cellWidth = Titanium.Platform.displayCaps.platformWidth / perRow;
                    var cellHeight = cellWidth;

                    var image = Titanium.UI.createImageView({
                        image: o.thumbnail,
                        width: cellWidth,
                        height: cellHeight,
                        bubbleParent: false,
                        cancelBubble: true,
                        ext: {
                            image: o.thumbnail,
                            filename: o.defaultRepresentation.filename,
                        }
                    });
                    Ti.API.info(o.defaultRepresentation.filename);

                    image.addEventListener('click', function(e) {
                        t = this;
                        t.hasCheck = !(t.hasCheck);
                        Ti.API.info(t.hasCheck);

                        if ( t.hasCheck ) {
                            var icon = Ti.UI.createImageView({
                                image: '/check_icon.jpg',
                                width: Titanium.Platform.displayCaps.platformWidth / 20,
                                height: Titanium.Platform.displayCaps.platformWidth / 20,
                                bubbleParent: false,
                                cancelBubble: true,
                                top: 0,
                                right: 0,
                            });
                            t.add(icon);
                        } else {
                            var children = t.children.slice(0);
                            if ( children ) {
                                for (var i = 0; i < children.length; i++) {
                                    t.remove(children[i]);
                                }
                            }
                        }
                    });
                    view.add(image);
                }
            });
        }
    }, function(e) {
    });

    var save_images_btn = Titanium.UI.createButton({title: 'save', height: 40, width: 100});
    save_images_btn.addEventListener('click', function() {
        save_images();
        alert('save images completed');
    });
    var tool_bar = Ti.UI.iOS.createToolbar({
        items: [save_images_btn],
        top: 0,
        height: 50 + 'dp',
        borderTop: false,
        borderButtom: true,
        barColor: '#999'
    });
    $.import_container.add(tool_bar);
    $.import_container.add(view);
}

function save_images() {
    var view = $.import_container.children.slice(0)[1];
    var images = view.children.slice(0);

    Ti.API.info("images.length: " + images.length);
    for (var i = 0; i < images.length; i++) {

        Ti.API.info("loop cnt : " + i);
        if ( !images[i].hasCheck ) { Ti.API.info("! hasCheck: " + i); continue; }

        var o = images[i];
        var id = get_image_seq();
        var file = Ti.Filesystem.getFile(
            Titanium.Filesystem.applicationDataDirectory + "/" + id + '.png'
        );
        if (!file.exists()) { file.createFile(); }
        file.write(o.image);
        save_image_info(id);
    }
}

function get_image_seq() {
    var id;

    var seq_image_r = Alloy.createCollection('seq_image');
    seq_image_r.fetch();

    var seq_image_w;
    if ( seq_image_r.length < 1 ) {
        seq_image_w = Alloy.createModel('seq_image', {"id" : 0});
        seq_image_w.save();
        seq_image_r = Alloy.createCollection('seq_image');
        seq_image_r.fetch();
    }

    seq_image_r.map(function(row) {
        id = row.get('id') + 1;
        row.set({'id':id});
        row.save();
    });
    return id;
}

function save_image_info(id) {
    var image_w = Alloy.createModel('image', {
        'id': id,
        'name': 'name' + id,
        'created_at': String(new Date().getTime())
    });
    image_w.save();
}

function get_tag_info_by_ids(ids) {
    if (!ids || ids.length == 0) { return; }

    var tag_r = Alloy.createCollection('image_tag');

    var ids_str = ids.join(',');
    tag_r.fetch({query: 'select * from image_tag where tag is not null and disabled = 0 and id in (' + ids_str + ')'});

    var tag_info = new Array();
    tag_r.map(function(row) {
        var image_id = row.get('id');
        var tag = row.get('tag');
        
        if ( ! tag_info[image_id] ) {
            tag_info[image_id] = new Array();
        }

        tag_info[image_id].push(tag);
    });
    return tag_info;

}

function set_tag_mini_icon(image_id, inner_view) {
    var tag_info = get_tag_info_by_ids([image_id]);
    if (!tag_info || !tag_info[image_id]) { return; }
    Ti.API.info("tag_info.length:" + tag_info[image_id].length);
    var tag_view = Ti.UI.createView({
        backgroundColor: 'white',
        top: 0,
        right: 0,
        width: 40,
        height: 20 * tag_info[image_id].length,
    });
    for (var i = 0; i < tag_info[image_id].length; i++) {
        var label = Ti.UI.createLabel({
            color: "#000",
            font: {
                fontSize: "4dp"
            },
            width: '40dp',
            textAlign: 'center',
            height: '20dp',
            top: (20 * i) + "dp",
            left: 0,
            right: 0,
            backgroundColor: "#ddd",
            borderColor: "black"
        });
        label.text = tag_info[image_id][i];
        label.name = tag_info[image_id][i];
        tag_view.add(label);
    }
    inner_view.add(tag_view);
}

$.index.open();
