$(function() {
    let tableCategories;
    let edit = false;

    let fieldsNames = [
        {
            data: 'nombre',
            "defaultContent": "No asignado"
        },
        {
            data: 'descripcion',
            "defaultContent": "No asignado"
        }
    ];

    tableCategories = $("#datatable").DataTable({
        "ajax": `/category/datatables-data`,
        "columns": fieldsNames,
        "columnDefs": [
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    return '<a href="#" class="btn btn-round btn-warning btn-icon btn-sm edit"><i class="far fa-calendar-alt"></i></a> <a href="#" class="btn btn-round btn-danger btn-icon btn-sm remove"><i class="fas fa-times"></i></a>';
                },
                "targets": 2
            }
        ],
        "pageLength": 20,
        "processing": true,
        "serverSide": true,
        "searching": true,
        "lengthChange": false,
        "ordering": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        }
    });

    $("#table-container").on("click", ".edit", function(e) {
        e.preventDefault();
        edit = true;
        var data = tableCategories.row( $(this).parents('tr') ).data();
        console.log(data);
        $("#nombre-edit").val(data["nombre"]);
        $("#descripcion-edit").val(data["descripcion"]);
        $("#_id-edit").val(data["_id"]);
        $("#myModal").modal();
    });

    $("#btn-modal-edit").click(function() {
        console.log("entro");
        let obj = {
            nombre: $("#nombre-edit").val(),
            descripcion: $("#descripcion-edit").val(),
            _id: $("#_id-edit").val()
        };

        console.log(obj);
        $.post( "/category/editCategory", obj, function() {
            $('#myModal').modal('hide');
            showAlert("success", "Cliente editado correctamente");

            tableCategories.ajax.reload();
        })
        .fail(function(data) {
            if(data.responseJSON && data.responseJSON.errors) {
                for(let i = 0; i < data.responseJSON.errors.length; i++) {
                    $(`#label-${data.responseJSON.errors[i].param}-edit`).addClass("text-danger");
                    $(`#${data.responseJSON.errors[i].param}-edit`).addClass("is-invalid");
                    $(`#div-text-error-${data.responseJSON.errors[i].param}-edit`).show();
                    $(`#text-error-${data.responseJSON.errors[i].param}-edit`).text(data.responseJSON.errors[i].msg);
                }
            }
        })
    });

    $("#table-container").on("click", ".remove", function(e) {
        e.preventDefault();
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

    $("#add-category").click(function() {
        if(validate()) {
            let obj = {
                nombre: $("#nombre").val(),
                descripcion: $("#descripcion").val()
            }

            $.post( "/category/newCategory", obj, function(res, xhr) {
                console.log(res);
                console.log(xhr);

                cleanForm();
                showAlert("success", "Se ha añadido correctamente la categoria");
                tableCategories.ajax.reload();
            }, "json")
            .fail(function(data, errorTextStatus) {
                if(errorTextStatus == "parsererror") {
                    $(location).attr('href', "/auth/login");
                } else {
                    if(data.responseJSON && data.responseJSON.errors) {
                        for(let i = 0; i < data.responseJSON.errors.length; i++) {
                            $(`#${data.responseJSON.errors[i].param}`).addClass("is-invalid")/*.prop("title", data.responseJSON.errors[i].msg)*/;
                            $(`#text-${data.responseJSON.errors[i].param}`).empty().html(data.responseJSON.errors[i].msg);
                        }
                    } else {
                        showAlert("danger", "Ha ocurrido un error añadiendo la categoria, por favor intente nuevamente");
                    }
                }
                // if(data.responseJSON && data.responseJSON.errors) {
                //     for(let i = 0; i < data.responseJSON.errors.length; i++) {
                //         $(`#${data.responseJSON.errors[i].param}`).addClass("has-error").prop("title", data.responseJSON.errors[i].msg);
                //     }
                // }
            });
        }
    });

    function validate() {
        console.log("entro");
        let valid = true;
        $("#nombre").removeClass("is-invalid");
        $("#descripcion").removeClass("is-invalid");
        
        if( $("#nombre").val() == "" || $("#descripcion").val() == null ) {
            console.log("entro aqui");
            $("#nombre").addClass("is-invalid");
            valid = false;
        }
        if( $("#descripcion").val() == "" || $("#descripcion").val() == null ) {
            console.log("entro aca");
            $("#descripcion").addClass("is-invalid");
            valid = false;
        }
        return valid;
    }

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

    function cleanForm() {
        $("#nombre").val("");
        $("#descripcion").val("");
    };
});