var animation = require('alloy/animation');

//////////////////////////////////////////////
// About View

function changeView1() {
    remove_open_list();
	changeView('tag_list');
	open_tag_list();
}
function changeView2() {
	changeView('camera');
	open_normal_camera();
//	open_camera_view();
}
function changeView3() {
	changeView('import_list');
	open_import_list();
}

function changeView(type) {
	var types = ['tag_list', 'camera', 'import_list'];
    var winInfo = new Array();
	for (var i = 0; i < types.length; i++) {
        var t = types[i];
		if(t == type) {
            winInfo[t] = {
                visible: true,
                buttonSize: 90,
            };
		} else {
            winInfo[t] = {
                visible: false,
                buttonSize: 70,
            };
		}
	}
	$.tag_list.visible    = winInfo['tag_list']['visible'];
	$.camera.visible      = winInfo['camera']['visible'];
	$.import_list.visible = winInfo['import_list']['visible'];

	$.button1.height = $.button1.width = winInfo['tag_list']['buttonSize'];;
	$.button2.height = $.button2.width = winInfo['camera']['buttonSize'];;
	$.button3.height = $.button3.width = winInfo['import_list']['buttonSize'];;

	adjustSpace();
}

function adjustSpace() {
	var viewWidth = Titanium.Platform.displayCaps.platformWidth;
	var centerPoint = new Array();
	for(var i = 1; i < 9; i++) {
		centerPoint[i] = viewWidth * i / 8;
	}
	$.button1.left = centerPoint[1] - $.button1.width/2;
	$.button2.left = centerPoint[4] - $.button2.width/2;
	$.button3.left = centerPoint[7] - $.button3.width/2;
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

    var tag_u = Alloy.createCollection('image_tag'); 
    tag_u.fetch({query: 'select * from image_tag where id = ' + id + ' and tag = "' + tag + '"'});
//    Ti.API.info( "tag_u.length : " + tag_u.models.length );
//    Ti.API.info( "tag_u.model : " + tag_u.models[0] );
//    tag_u.models[0].destroy();
//    tag_u.models[1].destroy();
//    Ti.API.info( "tag_u.length after : " + tag_u.length );
    if ( tag_u.length == 0 ) {
        var tag_i = Alloy.createModel('image_tag', {
            'id': id,
            'tag': tag,
            'disabled': 0,
            'created_at': String(new Date().getTime()),
            'updated_at': String(new Date().getTime())
        });
        tag_i.save();
        alert('save tag info succeeded id:' + id + "  tag:" + tag);
    }
    // delete tag into
    else {
        tag_u.map(function(row){
            var ii = row.get('id');
            var it = row.get('tag');
            var ic = row.get('created_at');
            var idis = row.get('disabled');

            row.set({'disabled':1});
            row.save();
        })
    }
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

function create_image_list(e) {

    var tag = e.source.ext.tag;
    Ti.API.info('create_image_list tag:' + tag);
    var data  = [];
    var image_ids;
    
    if (tag !== 'no tag') {
        var all_tag_groups = get_tag_groups();
        image_ids = new Array();
        for ( var t in all_tag_groups ) {
            for ( var im = 0; im < all_tag_groups[t].length; im++ ) {
                image_ids.push(all_tag_groups[t][im]);
            }
        }
    } else {
        image_ids = (get_tag_groups(tag))[tag];
    }

    // constants
    var perRow = 4;
    var cellWidth = Titanium.Platform.displayCaps.platformWidth / perRow;
    var cellHeight = cellWidth;

    var scrollView = Ti.UI.createScrollView({
        contentWidth: Ti.Platform.displayCaps.platformWidth,
        top: 50,
        contentHeight: 'auto',
        layout: 'horizontal',
        scrollType: 'vertical',
        cancelBubble: true
    });

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

        image.addEventListener('click', show_zoom_image);
        scrollView.add(image);
    }

    // parent view
    var parentView = Ti.UI.createView({
        backgroundColor: 'black'
    });
    parentView.add(scrollView);

    var cancel_btn = Titanium.UI.createButton({
        title: 'close',
        height: 40,
        width: 100,
        top: 0,
        right: 0,
        ext: {
            close_target: parentView
        }
    });
    cancel_btn.addEventListener('click', function(e) {
        var close_target = e.source.ext.close_target;
		animation.fadeOut(close_target, 500);
    });
    parentView.add(cancel_btn);
//    var flexSpace = Titanium.UI.createButton({
//        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
//    });
//    var tool_bar = Ti.UI.iOS.createToolbar({
//        items: [flexSpace, flexSpace, flexSpace, cancel_btn],
//        top: 0,
//        height: 50 + 'dp',
//        borderTop: false,
//        borderButtom: true,
//        barColor: '#999'
//    });


    $.index.add(parentView);
}

function get_tag_groups(tag) {
    var tag_r = Alloy.createCollection('image_tag');

    if (tag) {
        tag_r.fetch({query: 'select * from image_tag where tag is not null and id is not null and disabled = 0 and tag = ' + '"' + tag + '"'});
    }
    else {
        tag_r.fetch({query: 'select * from image_tag where tag is not null and id is not null and disabled = 0'});
    }
Ti.API.info( "tag_r.length : " + tag_r.length );

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

function remove_open_list() {
    var children = $.tag_list.children.slice(0);
    if (children) {
        for (var i = 0; i < children.length; i++) {
            Ti.API.info("remove children");
            $.tag_list.remove(children[i]);
        }
    }
}

function open_tag_list() {

    var tags = get_tag_groups();
    tags['no tag'] = get_images_without_tag();
	var tag_num = tags.length;
	
	var hostScrollView = Titanium.UI.createScrollView({
		top             : "0dp",
		left            : "0dp",
		contentWidth    : "100dp",
		height          : "100%",
		width           : "100%",
		contentHeight   : "auto",
		scrollType      : "vertical",
//		backgroundColor : "red",
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
			backgroundColor : "#ddd",
            ext: {
                tag: tag_name,
            }
		});
        guestTagLabel.addEventListener('click', create_image_list);
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
//			backgroundColor : "blue",
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
                image: Titanium.Filesystem.applicationDataDirectory + '/' + image_id + '.png',
                ext: {
                    id: image_id,
                }
			});
			imageListView.add(imageListImageView);
            imageListImageView.addEventListener('click', show_zoom_image);
			guestScrollView.add(imageListView);
		}
		hostScrollView.add(guestTagView);
		hostScrollView.add(guestScrollView);

        tag_count = tag_count + 1;
	}
    
	$.tag_list.add(hostScrollView);
};

function show_zoom_image(e) {
    var image_id = e.source.ext.id;

	var imageListBigImageBackView = Ti.UI.createView({
		backgroundImage: "/tag_table_back.png",
		width:"100%",
		height:"100%",
	});
	var imageListBigImageView = Ti.UI.createImageView({
		image: this.image,
		width: "80%",
		height: "80%",
        top: 0,
	});
	imageListBigImageBackView.add(imageListBigImageView);
    var tag_set = create_tag_set(e, imageListBigImageView);

    set_tag_mini_icon(image_id, imageListBigImageView);

	imageListBigImageBackView.add(tag_set);
    Ti.API.info("set tag_set end");

	imageListBigImageBackView.addEventListener('click', function(){
		animation.fadeOut(this, 500);
		//$.tag_list.remove(this);
	});
	$.index.add(imageListBigImageBackView);
}

function open_import_list() {

    var previous_views = $.import_list.children.slice(0);
    for (var i = 0; i < previous_views.length; i++) {
        $.import_list.remove(previous_views[i]);
    }
    
    var view = Ti.UI.createScrollView({
        contentWidth: Ti.Platform.displayCaps.platformWidth,
        contentHeight: 'auto',
        layout: 'horizontal',
        scrollType: 'vertical',
        cancelBubble: true,
        top: 40 + 'dp',
        bottom: 100 + 'dp',
        backgroundColor: '#FFEBCD',
    });
    
    var one_time_load_num = 40;
    var current_loaded_page = 0;
    var image;
    var perRow = 4;
    
    var assetslibrary = require('ti.assetslibrary');
    var g = [assetslibrary.AssetsGroupTypeAll];
    assetslibrary.getGroups(g, function(e) {
        var list = e.groups;
        for (var i = 0; i < list.length; i++) {
            var ao = list[i];
            Ti.API.info("name : " + ao.name);
            ao.getAssets(function(e) {
                var al = e.assets;
                var length = al.assetsCount;
                if (length < 1) {
                    return;
                }
                Ti.API.info("length : " + length);
                image = new Array(length);
                for (var i = 0; i < length; i++) {
                    var o = al.getAssetAtIndex(i);

                    var cellWidth = Titanium.Platform.displayCaps.platformWidth / perRow;
                    var cellHeight = cellWidth;

                    image[i] = Titanium.UI.createImageView({
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

                    image[i].addEventListener('click', function(e) {
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
                }
                var load_length = (image.length < one_time_load_num) ? image.length : one_time_load_num;
                for(var i = 0; i < load_length; i++) {
    				console.log(i);
    				view.add(image[i]);
    			}
    			current_loaded_page = load_length;
            });
        }
    }, function(e) {
    });
    
    view.addEventListener('scrollEnd', function(){
    	//TODO magic number 6
    	if (this.contentOffset.y > (current_loaded_page/perRow - 6) * image[0].height) {
     		var load_start_length = current_loaded_page;
    		var load_end_length = ((current_loaded_page + one_time_load_num) > image.length) ? image.length : (current_loaded_page + one_time_load_num);
        	for(var i = load_start_length; i < load_end_length; i++) {
    			console.log(i);
    			view.add(image[i]);
    		}
    		current_loaded_page = load_end_length;
    	}
    });
    
    var save_images_btn = Titanium.UI.createButton({title: 'save', height: 30, width: 60, right: 20});
    save_images_btn.addEventListener('click', function() {
        save_images();
        alert('save images completed');
    });

 	var top_view = Ti.UI.createView({
        width: Ti.Platform.displayCaps.platformWidth,
        height: '40',
        top: '0',
		backgroundColor: '#FFEBCD',
    });
    top_view.add(save_images_btn);
    $.import_list.add(top_view);
    $.import_list.add(view);
}

function save_images() {
    var view = $.import_list.children.slice(0)[1];
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
        var disabled = row.get('disabled');
        Ti.API.info('id:' + image_id + ' tag:' + tag + ' disabled:' + disabled);
        
        if ( ! tag_info[image_id] ) {
            tag_info[image_id] = new Array();
        }

        tag_info[image_id].push(tag);
    });
    return tag_info;

}

function set_tag_mini_icon(image_id, inner_view) {
    var children = inner_view.children.slice(0);
    if (children) {
        for (var c = 0; c < children.length; c++) {
            inner_view.remove(children[c]);
        }
    }

    var tag_info = get_tag_info_by_ids([image_id]);
    if (!tag_info || !tag_info[image_id]) { return; }
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

function open_normal_camera() {
	Titanium.Media.showCamera({
        success:function(event) {
            // called when media returned from the camera
            Ti.API.debug('Our type was: '+event.mediaType);
            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                var imageView = Ti.UI.createImageView({
                    width:$.camera.width,
                    height:$.camera.height,
                    image:event.media
                });
                // save image
                var id = get_image_seq();
                var file = Ti.Filesystem.getFile(
                	Titanium.Filesystem.applicationDataDirectory + "/" + id + '.png'
            	);
            	if (!file.exists()) { file.createFile(); }
            	file.write(imageView.image);
            	save_image_info(id);
                
                // after view
                changeView3();
            } else {
                alert("got the wrong type back ="+event.mediaType);
            }
        },
        cancel:function() {
            // called when user cancels taking a picture
        },
        error:function(error) {
            // called when there's an error
            var a = Titanium.UI.createAlertDialog({title:'Camera'});
            if (error.code == Titanium.Media.NO_CAMERA) {
                a.setMessage('Please run this test on device');
            } else {
                a.setMessage('Unexpected error: ' + error.code);
            }
            a.show();
        },
        saveToPhotoGallery: true,
        allowEditing: false,
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
    });
}

function open_camera_view() {
	var TiCamera = require('be.k0suke.ticamera');
	var cameraView = TiCamera.createView({
    	width: $.camera.width,
    	height: $.camera.height,
    	backgroundColor: '#000',
    	videoQuality: TiCamera.QUALITY_1280x720,
    	cameraPosition: is_front_camera() ? TiCamera.CAMERA_FRONT : TiCamera.CAMERA_BACK,
    	frameDuration: 16
	});
	$.camera.add(cameraView);
}

function is_front_camera() {
	return false;
}

//
function get_images_without_tag() {
    var with_tag = get_tag_groups();
    var all_images = get_image_path_list();
    var all_image_hash = {};
    for (var i = 0; i < all_images.length; i++) {
        all_image_hash[ all_images[i] ] = 1;
    }

    for (var t in with_tag) {
        for (var j = 0; j < t.length; j++) {
            var image_id = with_tag[t][j];
            Ti.API.info("image_id: " + image_id);
            if (all_image_hash[image_id]) {
                Ti.API.info("delete image_id: " + image_id);
                delete all_image_hash[image_id];
            }
        }
    }

    var without_tag = new Array();
    for (var id in all_image_hash) {
        without_tag.push(id);
    }
    return without_tag;
}

function create_tag_set(e, imageListBigImageView) {
    Ti.API.info(e);
    var image_id = e.source.ext.id;

//    var image_win = Ti.UI.createWindow({
//        backgroundColor: 'white'
//    });
//    var image_win_cancel_btn = Titanium.UI.createButton({title: 'close', height: 40, width: 100});
//    image_win_cancel_btn.addEventListener('click', function() {
//        image_win.close();
//    });
//    var image_view = Ti.UI.createView();
//    var inner_view = Ti.UI.createView();
//    var focused_image = Ti.UI.createImageView({
//        image: e.source.ext.image, 
//        top: 0,
//        right: 0,
//        width: "100%",
//        ext: {
//            id: image_id
//        },
//        layout: 'absolute'
//    });

    var tags = ['smile', 'sleep', 'angry', 'laugh', 'eat', 'cry'];
    var tag_set_view = Ti.UI.createView({
        backgroundColor: 'blue',
        opacity: 0.8,
        bottom: 0,
        height: 144,
        top: 400 + "dp"
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
    Ti.API.info("start create tags 2");
    for (var i = 0; i < tags.length; i++) {
        var v = Ti.UI.createView({
            backgroundColor: "#ffffff",
            borderWidth: 1,
            top: "0dp",
            height: "100dp",
            bubbleParent: false,
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
        });
        label.text = tags[i];
        label.name = tags[i];

        v.addEventListener('click', function(e){
            save_tag_info(image_id, this.ext.tag);
            set_tag_mini_icon(image_id, imageListBigImageView);
        });
        v.add(label);
        tag_set.add(v);
    }
    Ti.API.info("add tag_set");
    tag_set_view.add(tag_set);

    Ti.API.info("hide");
    //tag_set_view.hide();
    Ti.API.info("hide end");
    return tag_set_view;
}

$.index.open();
