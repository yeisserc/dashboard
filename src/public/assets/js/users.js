$(function() {
    let tableUsuarios;
    let selectAll = false;

    tableUsuarios = $("#datatable").DataTable({
        "ajax": `/user/datatables-data`,
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
                    let display = "";
                    for(let i = 0; i < data.length; i++) {
                        // catsNombres.push(data[i].nombre);
                        display += `<span class="badge badge-pill badge-primary">${data[i].nombre} <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a></span>`
                    }
                    // return `<input id="prueba" type="text" value="${catsNombres.join(",")}" class="tagsinput" data-role="tagsinput" data-color="danger" />`
                    
                    // return catsNombres.join(",");
                    return display;
                },
            },
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    return data == true ? "Activo" : "Inactivo";
                },
                "targets": 6
            },
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                className: "operations",
                "render": function ( data, type, row ) {
                    // console.log('active', row[6]);
                    if(row[6]) {
                        return '<a href="#" class="btn btn-round btn-danger btn-icon btn-sm desactivate"><i class="fas fa-times"></i></a>';
                    } else {
                        return '<a href="#" class="btn btn-round btn-info btn-icon btn-sm activate"><i class="fas fa-play"></i></a>';
                    }
                },
                "targets": 7
            }
         ],
         createdRow: function (row, data, index) {
            //
            // if the second column cell is blank apply special formatting
            //
            if (!data[6]) {
                $(row).addClass("not-selectable");
            }
        },
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
        },
        initComplete: function( settings, json ) {
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
        });
    });
    $(".dt-checkboxes-select-all > input[type='checkbox']").on( "click", function(e) {
        selectAll = !selectAll;
    });

    $("#table-container").on("click", ".desactivate",function(e) {
        e.preventDefault();
        var data = tableUsuarios.row( $(this).parents('tr') ).data();
        $("#_id-edit").val(data[0]);
        $("#nombre-delete-text").text(data[1] + " " + data[2]);
        $("#modalDelete").modal();
    });

    $("#table-container").on("click", ".activate",function(e) {
        // remove = true;
        e.preventDefault();
        var data = tableUsuarios.row( $(this).parents('tr') ).data();
        // console.log(data[0]);
        $.post( "/user/changeUserStatus", { _id: data[0], active: true }, function() {
            // $('#modalDelete').modal('hide');

            showAlert("success", "Se ha activado correctamente el usuario");

            tableUsuarios.ajax.reload();
        })
        .fail(function(data) {
            // $('#modalDelete').modal('hide');
            showAlert("danger", "Ha ocurrido un error activando el usuario, por favor intente nuevamente");
        });
    });

    $("#btn-modal-delete").click(function() {
        let obj = {
            _id: $("#_id-edit").val(),
            active: false
        };

        $.post( "/user/changeUserStatus", obj, function() {
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

    function showAlert(type, text) {
        let rem = "info";
        
        if(type == "success") {
            rem = "danger"
        }

        $("#alert-text").text(text);
        $("#alert").removeClass( `alert-${rem}` ).addClass( `alert-${type}` ).show();

        setTimeout(function() {
            $("#alert").fadeOut();
        }, 2000);
    }
});