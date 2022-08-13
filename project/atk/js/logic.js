var delayCounter = 3000;
const fullMonthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "October", "November", "Desember"];
const arrMonth = ['JAN','FEB','MAR','APR','MEI','JUNI','JULI','AGST','SEPT','OKT','NOV','DES'];
//Set Current Page for Sidebar
function setCurrentPage(){
    let hrefList = window.location.href.split('/');
    hrefList.splice(0, 3);
    let joinHref = hrefList.join("/");
    const navItemsElements = document.getElementsByClassName("nav-link");
    for (const i of navItemsElements){
        if("/"  + joinHref  == i.getAttribute("href")){
            i.classList.add("active");
            break;
        }
    }
}

// Input Number
function incrementValueInput(idInput ="", min="" , max=""){
    let el = document.getElementById(idInput);
    el.focus();
    if(el == null){
        alert(`Element ID:${idInput} not found`);
        return;
    }
    let val = parseFloat(el.value)  + 1;
    if(min != false && min > val ){
        val = min;
    }
    if(max != false && max < val ){
        val = max;
    }
    el.value = val;
}

function decrementValueInput(idInput ="", min="" , max=""){
    let el = document.getElementById(idInput);
    if(el == null){
        alert(`Element ID:${idInput} not found`);
        return;
    }
    el.focus();
    let val = parseFloat(el.value) - 1;
    if(min !== "" && min > val ){
        val = min;
    }
    if( max !== "" && max < val ){
        val = max;
    }
    el.value = val;
}

function enforceLimitValue(el){
    let min = parseInt(el.getAttribute('min'));
    let max = parseInt(el.getAttribute('max'));
    if(parseInt(el.value) < min){
        el.value = min;
    }
    if(parseInt(el.value) > max){
        el.value = max;
    }
}

/**
 * The difference between now and a prior or an
 * upcoming event, returned as readable text for humans.
 *
 *
 * @param {Number} unixTime milliseconds that have elapsed since
 *                          00:00:00 Thursday, 1 January 1970
 * @param {boolean} ms set true if unixTime is not in milliseconds
 * @return {String}
 */
function diffForHumans(unixTime, ms) {
    // Adjust for milliseconds
    ms = ms || false;
    unixTime = (ms) ? unixTime * 1000 : unixTime;

    var d = new Date();
    var diff = Math.abs(d.getTime() - unixTime);
    var intervals = {
        y: diff / (365 * 24 * 60 * 60 * 1 * 1000),
        m: diff / (30.5 * 24 * 60 * 60 * 1 * 1000),
        d: diff / (24 * 60 * 60 * 1 * 1000),
        h: diff / (60 * 60 * 1 * 1000),
        i: diff / (60 * 1 * 1000),
        s: diff / (1 * 1000),
    }

    Object.keys(intervals).map(function(value, index) {
        return intervals[value] = Math.floor(intervals[value]);
    })

    var unit;
    var count;

    switch (true) {
        case intervals.y > 0:
            count = intervals.y;
            unit = 'tahun';
            break;
        case intervals.m > 0:
            count = intervals.m;
            unit = 'bulan';
            break;
        case intervals.d > 0:
            count = intervals.d;
            unit = 'hari';
            break;
        case intervals.h > 0:
            count = intervals.h;
            unit = 'hour';
            break;
        case intervals.i > 0:
            count = intervals.i;
            unit = 'menit';
            break;
        default:
            count = intervals.s;
            unit = 'detik';
            break;

    }

    if(count === 0) {
        return 'sekarang';
    }

    return count + ' ' + unit + ((unixTime > d.getTime()) ? ' dari sekarang' : ' lalu');
}


// Error Trigger
const CustomError = function(name,message) {
    this.name = name ;
    this.message = message;
    this.stack = (new Error()).stack;
}

// Cache System
const ls = {
    set: function (variable, value, ttl_ms) {
        const data = {value: value, expires_at: new Date().getTime() + ttl_ms / 1};
        localStorage.setItem(variable.toString(), JSON.stringify(data));
    },
    get: function (variable) {
        const data = JSON.parse(localStorage.getItem(variable.toString()));
        if (data !== null) {
            if (data.expires_at !== null && data.expires_at < new Date().getTime()) {
                localStorage.removeItem(variable.toString());
            } else {
                return data.value;
            }
        }
        return null;
    },
    remove: function (variable) {
        localStorage.removeItem(variable.toString());
    }
};
// Get Data
async function getData(name,path="",query="") {
    async function requestData(url){
        const data = await fetch(
            url, {
                method: 'GET',
            }
        )
        return data.json();
    }

    const ref = serverStatus.find((obj) => obj.id == name);
    if(ref == null){
        const cached =ls.get(`${name}`);
        if(cached != null){
            return cached.data;
        }
        const newData = await requestData(name);
        ls.set(`${name}`,{ hit: -1, data:newData}, 3600000 );
        return newData;
    }
    let newQuery  = `?x0_0=${ref.hit}`;
    if(query != ""){
        newQuery = query + `&x0_0=${ref.hit}`;
    }
    const dataCache = ls.get(`${name}_${path}_${newQuery}`)
    if(dataCache != null && dataCache.hit == ref.hit){
        return dataCache.data;
    }


    try{
        const newData = await requestData(`/${name}${path}${newQuery}`);
        if(dataCache != null && JSON.stringify(newData) === JSON.stringify(dataCache.data)){
            return dataCache.data;
            //throw new CustomError('Same Data','Try Again');
        }
        ls.remove(`${ref.id}`);
        ls.set(`${name}_${path}_${newQuery}`,{ hit: ref.hit, data:newData}, 604800000);
        if(peringatan.remove(name) == true){
            peringatan.data(name, 'warning',
                `<i class="fa-solid fa-arrow-rotate-right"></i>
                            Silahkan Refresh/Reload Page ini untuk membuka data <b>${name.toUpperCase()}</b>
            `);
        }
        return newData;
    }catch(err){
        peringatan.data(name, 'danger',
            `<i class="fa-solid fa-triangle-exclamation"></i>
                    Data <b>${name.toUpperCase()}</b> gagal dibuka karena jaringan, Aplikasi akan mencoba dalam ${(delayCounter/1000).toFixed()} detik!
               `);
        console.log(`TryLoading data in ${delayCounter}s`);
        return  setTimeout(()=>{
            delayCounter = parseInt(delayCounter) + parseInt(((Math.random() * delayCounter).toFixed()));
            return getData(name,path,query);
        },delayCounter);
    }
}


// Simpan PDF
function generatePDF(el,filename, size =[1020,1400]){

    let doc = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'px',
        // format: [1020,1400],
        format:size,
        putOnlyUsedFonts: true,
    });

    console.log(el.offsetWidth);
    //target 770px+margin width
    window.html2canvas = html2canvas;
    // doc.addFont('/Arial-normal.js', '/Arial-normal.js', 'normal');
    // doc.setFont('Arial');
    doc.html(el,
        {
            callback: function (doc) {
                doc.save(filename);
            },
            x:10,
            y:10,

        });
}

// Get Value with Catch
function getValueIf(data,key="",except="",compare=null){
    if(data == compare){
        return except;
    }
    if(key == ""){
        return data;
    }
    return data[key];
}

//Hitung Barang dibeli
function hitungDibeli(diminta,tersedia){
    let hasil = parseFloat(tersedia)-parseFloat(diminta);
    if(hasil < 0){
        return  Math.abs(hasil);
    }
    return 0;
}

// Table Instance
const tableInstance = {
    instance: null ,
    config: {
        columns: [],
        data: [],
        resizable: true,
        pagination: {
            enabled: true,
            limit: 15,
            buttonsCount:1,
        },
        fixedHeader: true,
        search: true,
        sort: true,
        className: {
            td: 'custom-td',
            th: 'custom-th',
        },
        // height: '700px',
        style: {
            table: {
                'width': '100%'
            },
          },
        id_display: "table_display"
    },
    render(config){
        if(this.instance != null){
            this.instance.updateConfig(
                config
            ).forceRender();
        }else {
            this.instance = new gridjs.Grid(config).render(document.getElementById(config.id_display))
        }
    },
    async departemen(){
        this.config.columns = [
            {

                id: 'Kode',
                name: gridjs.html(`<div style="min-width:80px">Kode</div>`),
            },
            {
                id: 'Nama',
                name: gridjs.html(`<div style="min-width:150px">Nama</div>`),
            },
            {
                id: 'Aksi',
                name: gridjs.html(`<div style="min-width:100px">Aksi</div>`),
                formatter: (_, row) =>[
                    gridjs.html(`

                                    <button onclick="modalEdit.departemen('${row.cells[0].data}')" class="btn btn-warning"
                                        data-bs-toggle="modal" data-bs-target="#modal-edit" >
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button onclick="modalDelete.departemen('${row.cells[0].data}')" class="btn btn-outline-danger"
                                            data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                                       <i class="fa-solid fa-trash-can"></i>
                                    </button>
                  `)]
            }
            ,
        ];
        let data = await getData('departemen');
        this.config.data = data.map(departemen=> [departemen.kode, departemen.nama , null]);
        this.render(this.config);
    },
    async pengguna(){
        this.config.columns = [
            {
                id: 'ID',
                name: gridjs.html(`<div style="min-width:80px">ID</div>`),
            },
            {
                id: 'Nama',
                name: gridjs.html(`<div style="min-width:150px">Nama</div>`),
            },
            {
                id: 'Username',
                name: gridjs.html(`<div style="min-width:150px">Username</div>`),
            },
            {
                id: 'Dep',
                name: gridjs.html(`<div style="min-width:80px">Dep</div>`),
            },
            {
                id: 'Akses',
                name: gridjs.html(`<div style="min-width:100px">Akses</div>`),
            },
            {
                id: 'Jabatan',
                name: gridjs.html(`<div style="min-width:100px">Jabatan</div>`),
            },
            {
                id: 'Tanggal Buat Akun',
                name: gridjs.html(`<div style="min-width:150px">Pembuatan Akun</div>`),
            },
            {
                id: 'Aksi',
                name: gridjs.html(`<div style="min-width:100px">Aksi</div>`),
                formatter: (_, row) =>[
                    gridjs.html(`

                            <button onclick="modalEdit.pengguna('${row.cells[0].data}')"  class="btn btn-warning"
                             data-bs-toggle="modal" data-bs-target="#modal-edit" >
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button onclick="modalDelete.pengguna('${row.cells[0].data}')" class="btn btn-outline-danger"
                                    data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                               <i class="fa-solid fa-trash-can"></i>
                            </button>
                  `)]
            }
            ,
        ];
        let data = await getData('pengguna');
        function hakAkses(hakAksesNum){
            switch (hakAksesNum) {
               case 1: return "Manager";
               case 2 : return "Admin Dep.";
               case 3 : return "GAS User";
               case 4 : return "Super User";
               default: return "";
            }
        }
        this.config.data = data.map(
            pengguna => [
                pengguna.id,
                pengguna.nama ,
                pengguna.username,
                getValueIf(pengguna.departemen, "nama", ""),
                hakAkses(pengguna.hak_akses),
                pengguna.jabatan,
                pengguna.created_at, null]);
        this.render(this.config);
    },
    async jenisBarang(){
        this.config.columns = [
            {
                id: 'Kode',
                name: gridjs.html(`<div style="min-width:80px">Kode</div>`),
            },
            {
                id: 'Nama',
                name: gridjs.html(`<div style="min-width:150px">Nama</div>`),
            },
            {
                id: 'Satuan',
                name: gridjs.html(`<div style="min-width:100px">Satuan</div>`),
            },
            {
                id: 'Barcode',
                name: gridjs.html(`<div style="min-width:150px">Barcode</div>`),
            },
            {
                id: 'Aksi',
                name: gridjs.html(`<div style="min-width:100px">Aksi</div>`),
                formatter: (_, row) =>[
                    gridjs.html(`

                        <button  onclick="modalEdit.jenisBarang('${row.cells[0].data}')" class="btn btn-warning"
                                data-bs-toggle="modal" data-bs-target="#modal-edit" >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button onclick="modalDelete.jenisBarang('${row.cells[0].data}')" class="btn btn-outline-danger"
                                data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                           <i class="fa-solid fa-trash-can"></i>
                        </button>
                   `)]
            }
            ,
        ];

        let data = await getData('jenis_barang');
        this.config.data = data.map(
                jenisBarang => [
                    jenisBarang.kode,
                    jenisBarang.nama ,
                    jenisBarang.satuan,
                    jenisBarang.universal_product_code, null]);
        this.render(this.config);
    },
    async barangRiwayat(queryFilter = ''){
        this.config.columns = ['ID', 'Periode', 'Stock', 'Status', 'Harga', 'Departemen', ' Jenis Barang',
            {
                name: 'Aksi',
                formatter: (_, row) =>[
                    gridjs.html(`
                   <button onclick="modalEdit.barang('${row.cells[0].data}')" class="btn btn-warning"
                    data-bs-toggle="modal" data-bs-target="#modal-edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>`),
                    gridjs.html(`
                    <button onclick="modalDelete.barang('${row.cells[0].data}','id', '/barang/${row.cells[0].data}' )" class="btn btn-outline-danger"
                            data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                       <i class="fa-solid fa-trash-can"></i>
                    </button>`)]
            }];
        let data = await getData('barang','', queryFilter);
        const statusBarang = await getData('/barang/status');
        this.config.data = data.map(
            barang => [
                barang.id,
                barang.periode ,
                barang.stock,
                getValueIf(statusBarang.find(obj => {
                    return obj.int == barang.status;
                }), 'string', "" , undefined ),
                barang.harga,
                getValueIf(barang.departemen,key="nama",except="")  + "(" + barang.kode_departemen + ")" ,
                barang.jenis_barang.nama + "(" + barang.kode_jenis_barang  + ")", null]).reverse();
        this.render(this.config);
        return [['ID', 'Periode', 'Stock', 'Status', 'Harga', 'Departemen', ' Jenis Barang']].concat(this.config.data);
    },
    async barang(queryFilter = ''){
        this.config.autoWidth = true;
        this.config.pagination= false;
        this.config.columns = [
            {
                id: 'Kode',
                name: gridjs.html(`<div style="min-width:80px">Kode</div>`),
            },
            {
                id: 'Nama',
                name: gridjs.html(`<div style="min-width:150px">Nama</div>`),
            },
            {
                id:'Satuan',
                name: gridjs.html(`<div style="min-width:100px">Satuan</div>`),

            }, {
                id:'Diminta',
                name: gridjs.html(`<div style="min-width:120px"><i class="fa-solid fa-hand-holding-droplet"></i> Diminta</div>`),
            }, {
                id:'Tersedia',
                name: gridjs.html(`<div style="min-width:120px"><i class="fa-solid fa-square-check"></i> Tersedia</div>`),
            }, {
                id:'Hrs Dibeli',
                name: gridjs.html(`<div style="min-width:120px"><i class="fa-solid fa-basket-shopping"></i> Hrs Dibeli</div>`),
            }, {
                id:'Diterima',
                name: gridjs.html(`<div style="min-width:120px"><i class="fa-solid fa-people-carry-box"></i> Diterima</div>`),
            }, {
                id:'Habis',
                name: gridjs.html(`<div style="min-width:120px"><i class="fa-solid fa-arrow-up-short-wide"></i> Habis</div>`),
            },
            {
                id: 'Aksi',
                name: gridjs.html(`<div style="min-width:100px">Aksi</div>`),
                formatter: (_, row) =>[
                    gridjs.html(`

                   <button onclick="modalEdit.barang('${row.cells[0].data}')" class="btn btn-warning"
                    data-bs-toggle="modal" data-bs-target="#modal-edit" disabled>
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                `),
                 ]
            }];
        let data = await getData('barang', '/supply_demand',queryFilter);
        this.config.data = data.map(
            barang => [
                barang.kode,
                barang.nama ,
                barang.satuan,
                barang.diminta,
                barang.tersedia,
                hitungDibeli(barang.diminta,barang.tersedia),
                barang.diterima,
                barang.habis,
               ]);
        this.render(this.config);
        return [['Kode', 'Nama', 'Satuan', 'Diminta', 'Tersedia', 'Dibeli', 'Diterima','Habis']].concat(this.config.data);
    },
    async permintaan(){
        this.config.className.td = '';
        this.config.className.th = '';
        this.config.columns = [
            {
                id: 'ID',
                name: gridjs.html(`<div style="min-width:80px">ID</div>`),
            },
            {
                id: 'Tgl. Minta',
                name: gridjs.html(`<div style="min-width:100px">Tgl. Minta</div>`),
            },
            {
                id: 'Tenggat Wkt',
                name: gridjs.html(`<div style="min-width:100px">Tenggat Wkt</div>`),
            },
            {
                id: 'Dep.',
                name: gridjs.html(`<div style="min-width:90px">Dep.</div>`),
            },
            {
                id: 'Diajukan',
                name: gridjs.html(`<div style="min-width:120px">Diajukan</div>`),
            },
            {
                id: 'Disetujui',
                name: gridjs.html(`<div style="min-width:120px">Disetujui</div>`),
                formatter: (_, row) => gridjs.html(
                    getValueIf(row.cells[5].data,"",
                        `<a href="/permintaan/persetujuan/${row.cells[0].data}?redirect=/${currUser()}/permintaan" type="button" class="btn btn-secondary">
                                    <i class="fa-solid fa-clipboard-check"></i> Setujui Permintaan
                                </a>` , ""))
            },
            {
                id: 'Aksi',
                name: gridjs.html(`<div style="min-width:200px">Aksi</div>`),
                formatter: (_, row) =>
                    gridjs.html(`

                        <button onclick="modalPDF.permintaanHR146('${row.cells[0].data}')" class="btn btn-secondary ml-1"
                        data-bs-toggle="modal" data-bs-target="#modal-pdf"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Download / Export ke PDF" >
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button onclick="modalListBarang.permintaan('${row.cells[0].data}')" class="btn btn-info ml-1" data-bs-toggle="modal" data-bs-target="#modal-detail-daftar-barang"
                        data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Lihat Detail Barang">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </button>

                        <button onclick="modalEdit.permintaan('${row.cells[0].data}')" class="btn btn-warning ml-1"
                        data-bs-toggle="modal" data-bs-target="#modal-edit" data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Edit Data">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onclick="modalDelete.permintaan('${row.cells[0].data}')" class="btn btn-outline-danger ml-1"
                               data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Hapus/Batalkan Data">
                           <i class="fa-solid fa-trash-can"></i>
                        </button>
                   `),
            }
            ,
        ];
        let data = await getData('permintaan');
        this.config.data =  data.map(
            permintaan => [
                permintaan.id,
                permintaan.tanggal_permintaan ,
                permintaan.tenggat_waktu_barang,
                permintaan.departemen.nama,
                permintaan.pengguna_pengajuan.nama,
                getValueIf(permintaan.pengguna_persetujuan,"nama", "", null), null]).reverse();
        this.render(this.config);
        this.instance.on('ready', ()=>refreshToolTip());
    },
    async permintaanBarang(){
        this.config.className.td = '';
        this.config.className.th = '';
        this.config.columns = [
            'ID',
            'Butuh',
            'Keterangan',  'Jenis Barang' , 'Ref. Permintaan',
            {
                name: 'Aksi',
                formatter: (_, row) =>[
                    gridjs.html(`
            <button onclick="modalEdit.permintaanBarang('${row.cells[0].data}')" class="btn btn-warning"
            data-bs-toggle="modal" data-bs-target="#modal-edit" disabled>
                <i class="fa-solid fa-pen-to-square"></i>
            </button>`),
                    gridjs.html(`
            <button onclick="modalDelete.permintaanBarang('${row.cells[0].data}')" class="btn btn-outline-danger"
                    data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
               <i class="fa-solid fa-trash-can"></i>
            </button>`)]
            }
            ,
        ];
        let data = await getData('permintaan_barang');
        this.config.data = data.map(
            permintaanBarang => [
                permintaanBarang.id,
                permintaanBarang.kebutuhan  + " " + permintaanBarang.jenis_barang.satuan,
                permintaanBarang.keterangan,
                permintaanBarang.jenis_barang.nama + "(" + permintaanBarang.kode_jenis_barang + ")"  ,
                permintaanBarang.permintaan.tanggal_permintaan + " #" + permintaanBarang.id_permintaan,
                null]);
        this.render(this.config);
    },
    async tandaTerima(){
        this.config.className.td = '';
        this.config.className.th = '';
        this.config.columns =  [
            {
                id: 'ID',
                name: gridjs.html(`<div style="min-width:60px">ID</div>`),
            },
            {
                id: 'Tgl. Penerimaan',
                name: gridjs.html(`<div style="min-width:120px">Tgl. Penerimaan</div>`),
            },{
                id: 'Penerima',
                name: gridjs.html(`<div style="min-width:120px">Penerima</div>`),
            }
            , {
                id: 'Pemberi',
                name: gridjs.html(`<div style="min-width:120px">Pemberi</div>`),
                formatter: (_, row) => gridjs.html(
                    getValueIf(row.cells[3].data,"",
                        `<a href="/tanda_terima/persetujuan/${row.cells[0].data}?redirect=/${currUser()}/tanda_terima" type="button" class="btn btn-secondary">
                            <i class="fa-solid fa-person-circle-question"></i> Setujui Penerimaan</a>` , "")
                )
            },{
                id: 'Departemen',
                name: gridjs.html(`<div style="min-width:110px">Departemen</div>`),
            },
            {
                id: 'Aksi',
                name: gridjs.html(`<div style="min-width:200px">Aksi</div>`),
                formatter: (_, row) =>
                    gridjs.html(`

                <button onclick="modalPDF.tandaTerimaHR149('${row.cells[0].data}')" class="btn btn-secondary ml-1"
                    data-bs-toggle="modal" data-bs-target="#modal-pdf"  >
                        <i class="fa-solid fa-file-pdf"></i>
                </button>
                 <button onclick="modalListBarang.tandaTerima('${row.cells[0].data}')" class="btn btn-info ml-1" data-bs-toggle="modal" data-bs-target="#modal-detail-daftar-barang"
                        data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Lihat Detail Barang">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </button>
                <button onclick="modalEdit.tandaTerima('${row.cells[0].data}')"  class="btn btn-warning"
                data-bs-toggle="modal" data-bs-target="#modal-edit" disabled >
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="modalDelete.tandaTerima('${row.cells[0].data}')" class="btn btn-outline-danger"
                        data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                   <i class="fa-solid fa-trash-can"></i>
                </button>

            `)
            }
            ,
        ];
        const data = await getData('tanda_terima');
        this.config.data =  data.map(
            tt => [
                tt.id,
                diffForHumans(Date.parse(tt.tanggal)),
                tt.penerima_barang.nama,
                getValueIf(tt.pemberi_barang,"nama",""),
                tt.departemen.nama + " (" +  tt.kode_departemen+ ")",
                null]).reverse();
        this.render(this.config);
        this.instance.on('ready', ()=>refreshToolTip());
    },
    async tandaTerimaBarang(){
        alert("Belum dibuat");
    },
    async penyesuaianStok(){
        this.config.className.td = '';
        this.config.className.th = '';
        this.config.columns =  [

            {
                id: 'ID',
                name: gridjs.html(`<div style="min-width:60px">ID</div>`),
            },
            {
                id: 'Tanggal',
                name: gridjs.html(`<div style="min-width:120px">Tanggal</div>`),
            },
            {
                id: 'Departemen',
                name: gridjs.html(`<div style="min-width:100px">Departemen</div>`),
            },
            {
                id: 'Pembuat',
                name: gridjs.html(`<div style="min-width:100px">Pembuat</div>`),
            },
            {
                id: 'Persetujuan',
                name: gridjs.html(`<div style="min-width:100px">Persetujuan</div>`),
                formatter: (_, row) => gridjs.html(
                    getValueIf(row.cells[4].data,"",
                        `<a href="/penyesuaian_stok/persetujuan/${row.cells[0].data}?redirect=/${currUser()}/penyesuaian_stok" type="button" class="btn btn-secondary">
                                    <i class="fa-solid fa-clipboard-check"></i> Setujui Penyesuaian
                                </a>` , ""))
            },
            {
                name: 'Aksi',
                formatter: (_, row) =>
                    gridjs.html(`
                <div style="width:180px">
                <button onclick="modalPDF.penyesuaianStokHR147('${row.cells[0].data}')" class="btn btn-secondary ml-1"
                data-bs-toggle="modal" data-bs-target="#modal-pdf"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Download / Export ke PDF" >
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
                <button onclick="modalListBarang.penyesuaianStok('${row.cells[0].data}')" class="btn btn-info ml-1" data-bs-toggle="modal" data-bs-target="#modal-detail-daftar-barang"
                data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Lihat Detail Barang"
                 >
                    <i class="fa-solid fa-boxes-stacked"></i>
                </button>

                <button onclick="modalEdit.penyesuaianStok('${row.cells[0].data}')" class="btn btn-warning ml-1"
                data-bs-toggle="modal" data-bs-target="#modal-edit" disabled  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Edit Data">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="modalDelete.penyesuaianStok('${row.cells[0].data}')" class="btn btn-outline-danger ml-1"
                        data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Hapus/Batalkan Data">
                   <i class="fa-solid fa-trash-can"></i>
                </button></div>`),
            }
        ];
        const data = await getData('penyesuaian_stok');
        this.config.data =  data.map(
            penyesuaian => [
                penyesuaian.id,
                penyesuaian.tanggal ,
                penyesuaian.departemen.nama + "(" + penyesuaian.departemen.kode + ")",
                penyesuaian.pembuat.nama,
                getValueIf(penyesuaian.persetujuan,"nama", "", null), null]).reverse();
        this.render(this.config);
        this.instance.on('ready', ()=>refreshToolTip());
    },
    async daftarBarangStok(){
        alert("Belum dibuat");
    }
}

function downloadPDF(){
   const body = document.getElementById("modal-body-pdf");
   if(body == null){
       console.log("Modal body not found");
       return;
   }
   const title = document.getElementById("modal-title-pdf");
   generatePDF(body,title.innerText);
}

// Count Supply Demand Based History
async function depSupplyDemandBarang(dep,periode){
    const barang = await getData('barang');
    const jenisBarang = await getData('jenis_barang');
    const filteredData = barang.filter((brg)=>
        ( brg.kode_departemen == dep || brg.status == 2 ) && new Date(brg.periode).getTime() <= new Date(periode).getTime()
    ).sort((a, b) => {
        return new Date(a.periode).getTime() - new Date(b.periode).getTime();
    });
    console.log(filteredData);

    const tableSupply = jenisBarang.map((jb) => ({
        kode: jb.kode,
        nama: jb.nama,
        satuan: jb.satuan,
        diminta: 0,
        tersedia: 0,
        dibeli: () => hitungDibeli(this.diminta, this.tersedia),
        diterima: 0,
        habis: 0
    }));
    for(const brg of filteredData){
        const idx = tableSupply.findIndex((jb)=> jb.kode == brg.kode_jenis_barang);
        if(idx == -1){
            console.log("Data NF");
            continue;
        }
        if(brg.status == 1){
            tableSupply[idx].diminta += brg.stock;
        }else if(brg.status == 2){
            tableSupply[idx].tersedia += brg.stock;
        }else if(brg.status == 3){
            if(tableSupply[idx].tersedia > 0){
                tableSupply[idx].tersedia -= brg.stock;
            }else{
                console.log("Warn Tersedia Minus");
            }
            tableSupply[idx].diterima += brg.stock;
            tableSupply[idx].diminta -= brg.stock;
        }else if(brg.status ==4){
            tableSupply[idx].habis += brg.stock;
            tableSupply[idx].diterima -= brg.stock;
        }else{
            console.log("Not Found Status");
        }
        console.log(tableSupply[idx]);
    }

    return tableSupply;
}

function removeCardByID(id) {
    const el = document.getElementById(`${id}`);
    if(el != null){
        el.remove();
    }
}

function createExcel(title,sheetName,sheet2DData,mergeData){
    function downloadFileExcel(blob, filename) {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = filename;
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const wb = XLSX.utils.book_new();
    wb.Props = {
        Title: title,
        Subject: "GAS Staff",
        Author: "Inventori Barang Sistem",
        CreatedDate: new Date()
    };
    for(let i=0; i<sheetName.length; i++){
        wb.SheetNames.push(sheetName[i]);
        wb.Sheets[sheetName[i]] = XLSX.utils.aoa_to_sheet(sheet2DData[i]);
        //wb.Sheets[sheetName[i]]["!merges"] = mergeData[i];
    }

    downloadFileExcel(
        new Blob([s2ab(XLSX.write(wb, {bookType:'xlsx',  type: 'binary'}))],
            {type: "application/octet-stream"}),title)
}

function convertTo2D(arr){
    if(arr.length == 0){
        return [[]];
    }
    let grid = [];
    const listKey = Object.keys(arr[0]);
    for(const item of arr){
        let tmp = [];
        for(const j of listKey){
            if(! (j  in item)){
                tmp.push("");
            }else{
                tmp.push(item[j]);
            }
        }
        grid.push(
            tmp
        );
    }
    return grid;

}


const  selectInstance = {
    statusBarang: [],
};
const main = ()=>{
    setCurrentPage();
    document.querySelectorAll('.select-departemen').forEach((el)=>{
        new TomSelect(el,settingsSelectDepartemen);
    });
    document.querySelectorAll('.select-pengguna').forEach((el)=>{
        new TomSelect(el,settingsSelectPengguna);
    });
    document.querySelectorAll('.select-jenis-barang').forEach((el)=> {
        new TomSelect(el, settingsSelectJenisBarang);
    });
    document.querySelectorAll('.select-hak-akses').forEach((el)=> {
        new TomSelect(el,settingsHakAkses);
    });
    document.querySelectorAll('.select-permintaan').forEach((el)=> {
        new TomSelect(el,settingsSelectPermintaan);
    });
    document.querySelectorAll('.select-tanda-terima').forEach((el)=> {
        new TomSelect(el, settingsSelectTandaTerima);
    });
    document.querySelectorAll('.select-status-barang').forEach((el)=> {
        selectInstance.statusBarang.push(new TomSelect(el,settingsStatusBarang));
    });
    document.querySelectorAll('.select-penyesuaian-stok').forEach((el)=> {
        new TomSelect(el,settingsSelectPenyesuaianStok);
    });
    document.querySelectorAll('.select-permintaan-barang').forEach((el)=> {
        new TomSelect(el,settingsSelectPermintaanBarang);
    });
    document.querySelectorAll('.select-barang').forEach((el)=> {
        new TomSelect(el,settingsSelectBarang);
    });
}
