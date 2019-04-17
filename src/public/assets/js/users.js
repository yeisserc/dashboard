$(function() {
    let tableUsuarios;
    let selectAll = false;
    // let fieldsNames = [
    //     {
    //         "defaultContent": ""
    //     },
    //     {
    //         data: 'local.nombre',
    //         "defaultContent": "No asignado"
    //     },
    //     {
    //         data: 'local.apellido',
    //         "defaultContent": "No asignado"
    //     },
    //     {
    //         data: 'local.id_ciudad',
    //         "defaultContent": "No asignado"
    //     }
    // ];
    // let fieldsNames = [
    //     {
    //         "defaultContent": "no"
    //     },
    //     {
    //         "defaultContent": "No asignado"
    //     },
    //     {
    //         "defaultContent": "No asignado"
    //     },
    //     {
    //         "defaultContent": "No asignado"
    //     },
    //     {
    //         "defaultContent": "No asignado"
    //     }
    // ];

    tableUsuarios = $("#datatable").DataTable({
        "ajax": `/user/datatables-data`,
        // "columns": fieldsNames,
        // columnDefs: [ {
        //     orderable: false,
        //     className: 'select-checkbox',
        //     width: "5%",
        //     targets:   0
        // } ],
        // select: {
        //     style:    'os',
        //     selector: 'td:first-child'
        // },
        'columnDefs': [
            {
               'targets': 0,
               'checkboxes': {
                  'selectRow': false
               }
            },
            {
                'targets': 4,
                "defaultContent": "No asignado",
                "render": function ( data, type, row ) {
                    // return data ? "Si" : "No";
                    if(data) return '<i class="fas fa-check text-success"></i>';
                    return '<i class="fas fa-not-equal"></i>';
                },
            },
            {
                'targets': 5,
                "defaultContent": "No asignado",
                "render": function ( data, type, row ) {
                    let catsNombres = [];
                    for(let i = 0; i < data.length; i++) {
                        catsNombres.push(data[i].nombre);
                    }
                    return catsNombres.join(", ");
                },
            },
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    return data ? "Activo" : "Inactivo";
                },
                "targets": 6
            },
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                className: "operations",
                "render": function ( data, type, row ) {
                    return '<a href="#" class="btn btn-round btn-danger btn-icon btn-sm desactivate"><i class="fas fa-times"></i></a>';
                },
                "targets": 7
            }
         ],
         'select': {
            'style': 'multi'
         },
        "pageLength": 20,
        "processing": true,
        "serverSide": true,
        "searching": true,
        "lengthChange": false,
        "ordering": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        },
        select: {
            style: 'multi'
        },
        dom: "Bftipr",
        buttons: {
            buttons: [
                {
                    text: "Añadir categoria",
                    action: function(e, dt, node, config) {
                        //trigger the bootstrap modal
                        $.ajax({
                            url: '/user/cargar-categorias',
                            type: "GET",
                            success : function(res) {
                                let options = $("#categoria");
                                options.empty();
                                $.each(res, function(item) {
                                    options.append($("<option/>").val(this._id).text(this.nombre));
                                });
                                $('.selectpicker').selectpicker("refresh");
                                $("#myModal").modal();
                            }
                        });
                    }
                }
            ],
            dom: {
                button: {
                    tag: "button",
                    className: "btn btn-info"
                },
                buttonLiner: {
                    tag: null
                }
            }
        }
    });

    

    $("#btn-modal-aceptar").click(function() {
        console.log("entro");
        var rows_selected = tableUsuarios.column(0).checkboxes.selected();
        let ids = [];
        $.each(rows_selected, function(index, rowId){
            console.log(rowId);
            ids.push(rowId);
        });
        let categoria = $("#categoria").val();
        console.log($(".dt-checkboxes-select-all"));
        // let selectAll = $(".dt-checkboxes-select-all > input[type='checkbox']").is(':checked');
        let selectAll = $(".dt-checkboxes-select-all > input[type='checkbox']").prop('checked');
        let obj = {
            ids,
            categoria,
            selectAll
        };

        console.log(obj);
        $.post( "/user/addCategory", obj, function() {
            $('#myModal').modal('hide');
            // showAlert("success", "Cliente editado correctamente");
            tableUsuarios.ajax.reload();
        })
        .fail(function(data) {
            showAlert("danger", "Ha ocurrido un error");
            // if(data.responseJSON && data.responseJSON.errors) {
            //     for(let i = 0; i < data.responseJSON.errors.length; i++) {
            //         $(`#label-${data.responseJSON.errors[i].param}-edit`).addClass("text-danger");
            //         $(`#${data.responseJSON.errors[i].param}-edit`).addClass("is-invalid");
            //         $(`#div-text-error-${data.responseJSON.errors[i].param}-edit`).show();
            //         $(`#text-error-${data.responseJSON.errors[i].param}-edit`).text(data.responseJSON.errors[i].msg);
            //     }
            // }
        });
    });

    // $(".selectAll").on( "click", function(e) {
    //     if ($(this).is( ":checked" )) {
    //         tableUsuarios.rows(  ).select();        
    //     } else {
    //         tableUsuarios.rows(  ).deselect(); 
    //     }
    // });
    $(".dt-checkboxes-select-all > input[type='checkbox']").on( "click", function(e) {
        selectAll = !selectAll;
    });

    $("#table-container").on("click", ".desactivate",function(e) {
        // remove = true;
        e.preventDefault();
        var data = tableUsuarios.row( $(this).parents('tr') ).data();
        // console.log(data[0]);
        $("#_id-edit").val(data[0]);
        $("#nombre-delete-text").text(data[1] + " " + data[2]);
        $("#modalDelete").modal();
    });

    $("#btn-modal-delete").click(function() {
        let obj = {
            _id: $("#_id-edit").val()
        };

        $.post( "/user/desactivateUser", obj, function() {
            $('#modalDelete').modal('hide');

            showAlert("success", "Se ha desactivado correctamente el usuario");

            tableUsuarios.ajax.reload();
        })
        .fail(function(data) {
            $('#modalDelete').modal('hide');
            showAlert("danger", "Ha ocurrido un error desactivando el usuario, por favor intente nuevamente");
        });
    });

    $("#table-container").on("click", "td:not(.dt-checkboxes-cell,.operations)",function(e) {
        // remove = true;
        e.preventDefault();
        let data = tableUsuarios.row( $(this).parents('tr') ).data();
        $.post("/user/getUser", {_id: data[0]}, function(data) {
            let dni, email, celular = "No Posee", fijo = "No Posee", usuario_desde, whatsapp = false, facebook = false, twitter = false;
            usuario_desde = data.createdAt;
            if(data.local) {
                dni = data.local.dni || "No Posee";
                email = data.local.email || "No Posee";
                celular = data.local.celular || "No Posee";
                fijo = data.local.fijo || "No Posee";
            } else {
                if(data.facebook) {
                    dni = data.facebook.dni || "No Posee";
                    email = data.facebook.email || "No Posee";
                    facebook = true;
                }
            }

            if(data.twitter && data.twitter.token) {
                twitter = true;
            }

            whatsapp = data.CheckWhatsapp || false;

            $("#detailInfo").empty().html(`
                <div class='row'>
                    <div class='col-12'>
                        <p class='float-left'><span class="font-weight-bold">Registrado el:</span> ${moment(usuario_desde).format("DD/MM/YYYY")} a las ${moment(usuario_desde).format("HH:mm")}</p>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-12'>
                        <p><span class="font-weight-bold">DNI:</span> ${ dni  }</p>
                        <p><span class="font-weight-bold">Email:</span> ${ email  }</p>
                        <p><span class="font-weight-bold">Celular:</span> ${ celular  }</p>
                        <p><span class="font-weight-bold">Fijo:</span> ${ fijo  }</p>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-12'>
                        <span class="font-weight-bold">Redes: </span>
                        <i class="fab fa-facebook text-info ${facebook ? 'visible' : 'hide'}"></i>
                        <i class="fab fa-twitter text-info ${twitter ? 'visible' : 'hide'}"></i>
                        <i class="fab fa-whatsapp text-success ${whatsapp ? 'visible' : 'hide'}"></i>
                    </div>
                </div>
            `
            );
            $("#modalDetail").modal();
        })
        .fail(function(data) {
            alert('error');
        });
    });


    ///////////////////////////////////////////////////////////////////
    // var moveLeft = 0;
    // var moveDown = 0;
    // $("#table-container").on("hover", "td:not(.dt-checkboxes-cell,.operations)", function (e) {

    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     $(target).show();
    //     moveLeft = $(this).outerWidth();
    //     moveDown = ($(target).outerHeight() / 2);
    // }, function () {
    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     if (!($("#table-container td:not(.dt-checkboxes-cell,.operations)").hasClass("show"))) {
    //         $(target).hide();
    //     }
    // });

    // $("#table-container").on("mousemove", "td:not(.dt-checkboxes-cell,.operations)", function (e) {
    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     leftD = e.pageX + parseInt(moveLeft);
    //     maxRight = leftD + $(target).outerWidth();
    //     windowLeft = $(window).width() - 40;
    //     windowRight = 0;
    //     maxLeft = e.pageX - (parseInt(moveLeft) + $(target).outerWidth() + 20);

    //     if (maxRight > windowLeft && maxLeft > windowRight) {
    //         leftD = maxLeft;
    //     }

    //     topD = e.pageY - parseInt(moveDown);
    //     maxBottom = parseInt(e.pageY + parseInt(moveDown) + 20);
    //     windowBottom = parseInt(parseInt($(document).scrollTop()) + parseInt($(window).height()));
    //     maxTop = topD;
    //     windowTop = parseInt($(document).scrollTop());
    //     if (maxBottom > windowBottom) {
    //         topD = windowBottom - $(target).outerHeight() - 20;
    //     } else if (maxTop < windowTop) {
    //         topD = windowTop + 20;
    //     }

    //     $(target).css('top', topD).css('left', leftD);
    // });
    // $("#table-container").on("click", "td:not(.dt-checkboxes-cell,.operations)",function (e) {
    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     if (!($(this).hasClass("show"))) {
    //         $(target).show();
    //     }
    //     $(this).toggleClass("show");
    // });

    /////////////////////////////////////////////////////////////////

    // var moveLeft = 0;
    // var moveDown = 0;
    // $('a.popper').hover(function (e) {

    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     $(target).show();
    //     moveLeft = $(this).outerWidth();
    //     moveDown = ($(target).outerHeight() / 2);
    // }, function () {
    //     var target = '#' + ($(this).attr('data-popbox'));
    //     if (!($("a.popper").hasClass("show"))) {
    //         $(target).hide();
    //     }
    // });

    // $('a.popper').mousemove(function (e) {
    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     leftD = e.pageX + parseInt(moveLeft);
    //     maxRight = leftD + $(target).outerWidth();
    //     windowLeft = $(window).width() - 40;
    //     windowRight = 0;
    //     maxLeft = e.pageX - (parseInt(moveLeft) + $(target).outerWidth() + 20);

    //     if (maxRight > windowLeft && maxLeft > windowRight) {
    //         leftD = maxLeft;
    //     }

    //     topD = e.pageY - parseInt(moveDown);
    //     maxBottom = parseInt(e.pageY + parseInt(moveDown) + 20);
    //     windowBottom = parseInt(parseInt($(document).scrollTop()) + parseInt($(window).height()));
    //     maxTop = topD;
    //     windowTop = parseInt($(document).scrollTop());
    //     if (maxBottom > windowBottom) {
    //         topD = windowBottom - $(target).outerHeight() - 20;
    //     } else if (maxTop < windowTop) {
    //         topD = windowTop + 20;
    //     }

    //     $(target).css('top', topD).css('left', leftD);
    // });
    // $('a.popper').click(function (e) {
    //     // var target = '#' + ($(this).attr('data-popbox'));
    //     var target = '#pop1';
    //     if (!($(this).hasClass("show"))) {
    //         $(target).show();
    //     }
    //     $(this).toggleClass("show");
    // });
});