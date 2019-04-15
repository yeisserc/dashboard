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
                  'selectRow': true
               }
            },
            {
                'targets': 4,
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
                    return '<a href="#" class="btn btn-round btn-danger btn-icon btn-sm desactivate"><i class="fas fa-times"></i></a>';
                },
                "targets": 5
            }
         ],
         'select': {
            'style': 'multi'
         },
        "pageLength": 20,
        "processing": true,
        "serverSide": true,
        "searching": false,
        "lengthChange": false,
        "ordering": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        },
        select: {
            style: 'multi'
        },
        dom: "lBtipr",
        buttons: {
            buttons: [
                {
                    text: "Añadir categoria",
                    action: function(e, dt, node, config) {
                        //trigger the bootstrap modal
                        $.ajax({
                            url: '/cargar-categorias',
                            type: "POST",
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

    $("#table-container").on("click", ".remove",function() {
        remove = true;
        var data = tableCategories.row( $(this).parents('tr') ).data();
        $("#_id-edit").val(data["_id"]);
        $("#nombre-delete-text").text(data["nombre"]);
        $("#modalDelete").modal();
    });

    $("#btn-modal-delete").click(function() {
        let obj = {
            _id: $("#_id-edit").val()
        };

        $.post( "/category/deleteCategory", obj, function() {
            $('#modalDelete').modal('hide');

            showAlert("success", "Se ha eliminado correctamente la categoría");

            tableCategories.ajax.reload();
        })
        .fail(function(data) {
            $('#modalDelete').modal('hide');
            showAlert("danger", "Ha ocurrido un error eliminando la categoria, por favor intente nuevamente");
        });
    });
});