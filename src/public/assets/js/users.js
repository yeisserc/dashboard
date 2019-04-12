$(function() {
    let products;
    let fieldsNames = [
        {
            data: 'local.nombre'
        },
        {
            data: 'local.apellido'
        },
        {
            data: 'local.id_ciudad'
        }
    ];

    products = $("#datatable").DataTable({
        "ajax": `/datatables-data`,
        "columns": fieldsNames,
        // "columnDefs": [
        //     {
        //         // The `data` parameter refers to the data for the cell (defined by the
        //         // `data` option, which defaults to the column being worked with, in
        //         // this case `data: 0`.
        //         "render": function ( data, type, row ) {
        //             if(data == 0) {
        //                 return '<label class="badge badge-warning">Pendiente</label>';
        //             } else {
        //                 return '<label class="badge badge-success">Pagado</label>';
        //             }
        //         },
        //         "targets": 3
        //     }
        // ],
        "pageLength": 5,
        "processing": true,
        "serverSide": true,
        "searching": false,
        "lengthChange": false,
        "ordering": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        }
    });
});