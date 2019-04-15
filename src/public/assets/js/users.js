$(function() {
    let tableUsuarios;
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
    let fieldsNames = [
        {
            "defaultContent": "no"
        },
        {
            "defaultContent": "No asignado"
        },
        {
            "defaultContent": "No asignado"
        },
        {
            "defaultContent": "No asignado"
        }
    ];

    tableUsuarios = $("#datatable").DataTable({
        "ajax": `/user/datatables-data`,
        "columns": fieldsNames,
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
        console.log(rows_selected);
        let ids = [];
        $.each(rows_selected, function(index, rowId){
            console.log(rowId);
            ids.push(rowId);
        });
        let categoria = $("#categoria").val();
        let obj = {
            ids,
            categoria
        };

        console.log(obj);
        // $.post( "/user/addCategory", obj, function() {
        //     $('#myModal').modal('hide');
        //     // showAlert("success", "Cliente editado correctamente");

        //     tableUsuarios.ajax.reload();
        // })
        // .fail(function(data) {
        //     showAlert("danger", "Ha ocurrido un error");
        //     // if(data.responseJSON && data.responseJSON.errors) {
        //     //     for(let i = 0; i < data.responseJSON.errors.length; i++) {
        //     //         $(`#label-${data.responseJSON.errors[i].param}-edit`).addClass("text-danger");
        //     //         $(`#${data.responseJSON.errors[i].param}-edit`).addClass("is-invalid");
        //     //         $(`#div-text-error-${data.responseJSON.errors[i].param}-edit`).show();
        //     //         $(`#text-error-${data.responseJSON.errors[i].param}-edit`).text(data.responseJSON.errors[i].msg);
        //     //     }
        //     // }
        // });
    });

    // $(".selectAll").on( "click", function(e) {
    //     if ($(this).is( ":checked" )) {
    //         tableUsuarios.rows(  ).select();        
    //     } else {
    //         tableUsuarios.rows(  ).deselect(); 
    //     }
    // });
});