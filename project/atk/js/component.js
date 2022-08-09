var tooltipTriggerList = [];
var tooltipList = [];

function refreshToolTip(){
    tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
    tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
const elFormModalInput = document.getElementById('modal-form-input');

function checkInputEnableButtonSubmit(el,valueCheck = "", btnConfirmID = "") {
    const btnHapusConfirm = document.getElementById(btnConfirmID);
    if(el.value == valueCheck){
        btnHapusConfirm.disabled = false;
    }else{
        btnHapusConfirm.disabled = true;
    }
}

function toggleSidebar() {
    const elSidebar = document.getElementById('sidebarMenu');
    const elMainContent = document.getElementsByTagName('main')[0];
    if(elSidebar.style.display == 'none'){
        elSidebar.style.display = null;
        elSidebar.classList.add('d-md-block');
        elMainContent.classList.remove("col-12");
        elMainContent.classList.add("col-md-9");
    }else{
        elSidebar.style.display = 'none';
        elSidebar.classList.remove('d-md-block');
        elMainContent.classList.add("col-12");
        elMainContent.classList.remove("col-md-9");
        elMainContent.classList.remove("col-lg-9");
    }
}

const peringatan = {
    data: function(konteks, jenisPeringatan, htmlData){
        const elPg = document.getElementById('progress-notif');
        if (elPg == null) {
            return;
        }
        let elData = document.getElementById( `progress-notif-${konteks}`);
        if(elData == null){
          elData = document.createElement("div");
        }
        elData.id = `progress-notif-${konteks}`;
        elData.innerHTML = `
             <div class="row d-flex justify-content-center px-2">
                <div class="alert alert-${jenisPeringatan}" role="alert" style="max-width:768px;">
                    ${htmlData}
                </div>
            </div>
         `;
        elPg.appendChild(elData);
    },
    remove: function (konteks) {
        const elPg = document.getElementById( `progress-notif-${konteks}`);
        if (elPg == null) {
            return false;
        }
        elPg.remove();
        return true;
    }
}

const modalEdit = {
    elFormEdit(){
       return  document.getElementById('modal-form-edit');
    },
    elInputEdit(){
        return  document.getElementById('modal-form-input');
    },
    async departemen(idData){
        const deptArr  = await getData('departemen');
        const departemen = deptArr.find((dep)=> dep.kode == idData);
        this.elFormEdit().action = `/departemen/${idData}`;
        this.elInputEdit().innerHTML =
            `
               <div class="col-12">
                    <label for="kode_update" class="form-label">Kode Departemen</label>
                    <input type="text" class="form-control" id="kode_update" name="kode" autocomplete="off" value="${departemen.kode}" required>
                </div>

                <div class="col-12">
                    <label for="nama_update" class="form-label">Nama Departemen</label>
                    <input type="nama" class="form-control" id="nama_update" name="nama" autocomplete="off" value="${departemen.nama}" required>
                </div>

            `;
    },
    async pengguna(idData){
        const penggunaArr  = await getData('pengguna');
        const pengguna = penggunaArr.find((p)=> p.id == idData);
        this.elFormEdit().action = `/pengguna/${idData}`;
        this.elInputEdit().innerHTML =
            `  <div class="col-12">
                    <label for="nama_update" class="form-label">Nama</label>
                    <input type="text" class="form-control" id="nama_update" name="nama" autocomplete="off" value="${pengguna.nama}"  required>
                </div>
               <div class="col-12">
                        <label for="usernama_update" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username_update" name="username" autocomplete="off" value="${pengguna.username}"  required>
                </div>
               <div class="col-12">
                        <label for="password_update" class="form-label">Ganti Password</label>
                        <input type="password" class="form-control" id="password_update" name="password" >
                </div>
               <div class="col-12">
                    <label for="select_hak_akses_update" class="form-label">Hak Akses</label>
                    <select id="select_hak_akses_update"  name="hak_akses" data-placeholder="Pilih Hak Akses"  autocomplete="off"  required>
                    </select>
               </div>
               <div class="col-12">
                    <label for="jabatan_update" class="form-label">Jabatan</label>
                    <input type="text" class="form-control" id="jabatan_update" name="jabatan" value="${pengguna.jabatan}" autocomplete="off"  required>
               </div>
               <div class="col-12">
                    <label for="select_departemen_update" class="form-label">Departemen (Opsional)</label>
                    <select  id="select_departemen_update"  name="departemen" data-placeholder="Pilih Departemen"  autocomplete="off">
                    </select>
               </div>
            `;
        const departemenSelect  = new TomSelect('#select_departemen_update',settingsSelectDepartemen);
        const hakAksesSelect  = new TomSelect('#select_hak_akses_update',settingsHakAkses);
        if(pengguna.kode_departemen != null){
            departemenSelect.on('load',() => departemenSelect.setValue(pengguna.kode_departemen));
            departemenSelect.load();
        }
        hakAksesSelect.on('load',() => hakAksesSelect.setValue(pengguna.hak_akses));
        hakAksesSelect.load();
    },
    async jenisBarang(idData){
            const jbArr  = await getData('jenis_barang');
            const jb = jbArr.find((jb)=> jb.kode == idData);
            this.elFormEdit().action = `/jenis_barang/${idData}`;
            this.elInputEdit().innerHTML =
                `
                <div class="col-12">
                    <label for="nama_update" class="form-label">Nama</label>
                    <input type="text" class="form-control" id="nama_update" name="nama" autocomplete="off" value="${jb.nama}" onchange="updateKodeUnik(this,'kode_update')"  required>
                </div>
                <div class="col-12">
                    <label for="kode_update" class="form_label">Kode Unik Barang</label>
                    <input type="text" class="form-control" id="kode_update" name="kode" value="${jb.kode}"  autocomplete="off"  required>
                </div>
                <div class="col-12">
                    <label for="satuan_update" class="form-label">Satuan</label>
                    <input type="text" class="form-control" id="satuan_update" name="satuan" value="${jb.satuan}" autocomplete="off"  required>
                </div>
                <div class="col-12">
                    <label for="universal_product_code_update" class="form-label">Universal Product Code</label>
                    <input type="text" class="form-control" id="universal_product_code_update" value="${getValueIf(jb.universal_product_code,"","")}" name="universal_product_code" autocomplete="off" >
                </div>
            `;
    },
    async barang(idData){
        const jbArr  = await getData('barang');
        const item = jbArr.find((jb)=> jb.id == idData);
        this.elFormEdit().action = `/barang/${idData}`;
        const periode = new Date(item['periode']);
        this.elInputEdit().innerHTML =
            `
                 <div class="col-12">
                            <label for="periode_update" class="form-label">Periode</label>
                            <input type="month" class="form-control" id="periode_update" name="periode" autocomplete="off" value="${ periode.toISOString().slice(0,7)}"  required>
                        </div>
                         <div class="col-12">
                            <label for="stock_update" class="form-label">Stock</label>
                            <div class="input-group">
                                <button class="btn btn-success" type="button" onclick="incrementValueInput('stock', 0)"><i class="fa-solid fa-plus"></i></button>
                                <input type="number" step="0.01" class="form-control" min="0" id="stock_update" name="stock"  value="${item['stock']}" autocomplete="off"  required>
                                <button class="btn btn-danger" type="button" onclick="decrementValueInput('stock', 0)"><i class="fa-solid fa-minus"></i></button>
                            </div>
                        </div>
                        <div class="col-12">
                                <label for="select_status_update" class="form-label">Status</label>
                                <select id="select_status_update" name="status" autocomplete="off"  required>
                                </select>
                        </div>
                        <div class="col-12">
                            <label for="harga_update" class="form-label">Harga</label>
                            <div class="input-group">
                                <button class="btn btn-success" onclick="incrementValueInput('harga', 0)" type="button"><i class="fa-solid fa-plus"></i></button>
                                <input type="number" step="0.01"  class="form-control" id="harga_update" name="harga" min="0" value="${item['harga']}" required>
                                <button class="btn btn-danger" onclick="decrementValueInput('harga', 0)" type="button" ><i class="fa-solid fa-minus"></i></button>
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="kode_departemen_update" class="form-label">Departemen</label>
                            <select name="kode_departemen" id="select_departemen_update"  data-placeholder="Ketik untuk mencari Departemen ..."  autocomplete="off">
                            </select>
                        </div>
                        <div class="col-12">
                            <label for="select_jenis_barang_update" class="form-label">Jenis Barang</label>
                            <select name="kode_jenis_barang" id="select_jenis_barang_update" data-placeholder="Ketik untuk mencari Jenis Barang ..."  autocomplete="off">
                            </select>
                        </div>
            `;
        const statusSelect = new TomSelect('#select_status_update', settingsStatusBarang);
        const departemenSelect = new TomSelect('#select_departemen_update', settingsSelectDepartemen);
        const jenisBarangSelect = new TomSelect('#select_jenis_barang_update',settingsSelectJenisBarang );
        if (item['kode_departemen'] != null) {
            departemenSelect.on('load', () => departemenSelect.setValue(item['kode_departemen']));
            departemenSelect.load();
        }
        statusSelect.on('load', () => statusSelect.setValue(item['status']));
        statusSelect.load();
        jenisBarangSelect.on('load', () => jenisBarangSelect.setValue(item['kode_jenis_barang']));
        jenisBarangSelect.load();
    },
    async permintaan(idData){
        alert("Belum diImplementasi edit seperti gas departemen");
    },
    async permintaanBarang(idData){
        const jbArr  = await getData('permintaan_barang');
        const jb = jbArr.find((jb)=> jb.kode == idData);
        this.elFormEdit().action = `/permintaan_barang/${idData}`;
        alert('Belum Tersedia ', jb);
    },
    async tandaTerima(idData){
        const jbArr  = await getData('tanda_terima');
        const tt = jbArr.find((tt)=> tt.id == idData);
        this.elFormEdit().action = `/tanda_terima/${idData}`;
        alert('Belum Tersedia ', tt);
    },
};

const modalDelete = {
    elFormDelete(){
      return document.getElementById('modal-form-delete');
    },
    elInputDelete(){
        return document.getElementById('modal-body-delete');
    },
    async departemen(idData){
        this.elFormDelete().action = `/departemen/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="kode" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async pengguna(idData){
        this.elFormDelete().action = `/pengguna/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async jenisBarang(idData){
        this.elFormDelete().action = `/jenis_barang/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="kode" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async barang(idData){
        this.elFormDelete().action = `/barang/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async permintaan(idData){
        this.elFormDelete().action = `/permintaan/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async permintaanBarang(idData){
        this.elFormDelete().action = `/permintaan_barang/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async tandaTerima(idData){
        this.elFormDelete().action = `/tanda_terima/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
}

const modalListBarang = {
    modalBody(){
        return document.getElementById('body-detail-daftar-barang');
    },
    async permintaan(idPermintaan){
        const arrPermintaan = await getData('permintaan');
        const arrJenisBarang = await getData('jenis_barang');
        const permintaan = arrPermintaan.find((p)=> p.id == idPermintaan);
        if(permintaan == null){
            console.log("Permintaan Tidak Ada");
            return ;
        }
        this.modalBody().innerHTML = "";
        for(const minta_brg of permintaan.daftar_barang){
            const newNode = document.createElement("div");
            const jb = arrJenisBarang.find((jb)=> jb.kode == minta_brg.kode_jenis_barang );
            newNode.innerHTML = `
            <div class="card mb-3" >
                <div class="card-header d-flex justify-content-end">${minta_brg.kode_jenis_barang}</div>
                <div class="card-body text-dark">
                    <div class="form-floating">
                      <select class="form-select">
                        <option selected value="">${jb.nama}</option>
                      </select>
                      <label>Jenis Barang</label>
                    </div>
                    <div class="input-group mt-2">
                        <input type="number" step="0.01"  class="form-control" min="0" value="${minta_brg.kebutuhan}" disabled>
                        <button class="btn btn-outline-secondary" type="button" >${jb.satuan}</button>
                    </div>
                    <div class="form-floating mt-2">
                      <input type="text" class="form-control"  value="${minta_brg.keterangan}" disabled>
                      <label>Keterangan</label>
                    </div>
                </div>
            </div>`;
            this.modalBody().insertBefore(newNode, this.modalBody().children[0]);
        }
    }

}

const modalPDF = {
    modalBody(){
        return document.getElementById('modal-body-pdf');
    },
    modalTitle(){
        return document.getElementById('modal-title-pdf');
    },
    dataTable(page=1){
        return document.getElementById(`data-table-${page}-pdf`);
    },
    async permintaanHR146(id){
        const arrPermintaan = await getData(`permintaan`);
        const permintaan = arrPermintaan.find((p)=>p.id == id);

        let dateCurr = new Date();
        this.modalTitle().innerText = "Permintaan HR-146";
        if(permintaan == null){
            this.modalBody().innerHTML =  `Tidak ditemukan Permintaan`;
            return;
        }
        if(permintaan.pengguna_persetujuan == null){
            this.modalBody().innerHTML =  `Tidak didapat mengubah ke PDF harus dilakukan persetujuan terlebih dahulu`;
            return;
        }
        this.modalBody().innerHTML = "";
        const datePermintaan = new Date(permintaan.tanggal_permintaan);
        const headerPDF = `
                <table  class="pdf-table text-center"  cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none'  colspan="10">PT. INDOFOOD CBP SUKSES MAKMUR Tbk</td>
                       <td class='table-border-left'  colspan="7"> Kode Form: HR-146</td>
                     </tr>
                     <tr>
                       <td class='table-border-none'  colspan="10">DIVISI NOODLE - PABRIK BANDUNG</td>
                       <td class='table-border-left' colspan="7">No. Terbitan:1.0</td>
                     </tr>
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                     </tr>
               </table>`;
        const footerPDF = `
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">Padalarang, ${dateCurr.getDate()} ${fullMonthNames[dateCurr.getMonth()]} ${dateCurr.getFullYear()}</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none text-center'  colspan="5">
                           Diajukan Oleh,

                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                        <td class='table-border-none text-center' colspan="3">
                            Disetujui Oleh,
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-top text-center' colspan="5">
                            ${permintaan.pengguna_pengajuan.nama}
                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                       <td class='table-border-top text-center' colspan="3">
                            ${permintaan.pengguna_persetujuan.nama}
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>`;
        this.modalBody().innerHTML = `${headerPDF}<br><table class="pdf-table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>FORM PERMINTAAN ALAT TULIS KANTOR(ATK)</b></td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table  style="width:350px"><tr><td width="30%">Bulan</td> <td width="70%">: ${fullMonthNames[datePermintaan.getMonth()]} ${datePermintaan.getFullYear()}</td></tr></table></td>
                     </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table style="width:350px"><tr><td width="30%">Departemen</td> <td width="70%">: <b>${permintaan.departemen.nama}</b></td></tr></table></td>
                    </tr>
                    <tr>
                        <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" width="5%" >NO</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="20%" >JENIS BARANG</td>
                        <td  class='table-border-full text-center'  style="background-color:#d0d0d0;" colspan="2"width="12%" >SATUAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="2"  width="12%">STOCK BARANG</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="12%" >KEBUTUHAN</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="12%" >TOTAL PERMINTAAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  width="30%" >KETERANGAN</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                    <tbody id="data-table-1-pdf">

                    </tbody>
                    ${footerPDF}
               </table>
        `;
        let counter = 1;
        let pages = 1;
        for (const brg of permintaan.daftar_barang) {
             this.dataTable(pages).insertAdjacentHTML('beforeend',
        `<tr>
                <td class='table-border-none' >&nbsp</td>
                <td class='table-border-full p-1' >${counter}</td>
                <td class='table-border-full p-1' colspan="4" >${brg.jenis_barang.nama}</td>
                <td  class='table-border-full p-1' colspan="2" >${brg.jenis_barang.satuan}</td>
                <td class='table-border-full p-1 text-center' colspan="2" >10</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >${brg.kebutuhan}</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >-99</td>
                <td class='table-border-full p-1'  >${brg.keterangan}</td>
                <td class='table-border-none' >&nbsp</td>
             </tr>
            `);
            counter++;
        }
    },
    async permintaanHR149(id){
        const arrPermintaan = await getData(`permintaan`);
        const permintaan = arrPermintaan.find((p)=>p.id == id);

        let dateCurr = new Date();
        this.modalTitle().innerText = "Permintaan HR-146";
        if(permintaan == null){
            this.modalBody().innerHTML =  `Tidak ditemukan Permintaan`;
            return;
        }
        if(permintaan.pengguna_persetujuan == null){
            this.modalBody().innerHTML =  `Tidak didapat mengubah ke PDF harus dilakukan persetujuan terlebih dahulu`;
            return;
        }
        const datePermintaan = new Date(permintaan.tanggal_permintaan);
        const headerPDF = `
                <table  class="pdf-table text-center"  cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none'  colspan="10">PT. INDOFOOD CBP SUKSES MAKMUR Tbk</td>
                       <td class='table-border-left'  colspan="7"> Kode Form: HR-146</td>
                     </tr>
                     <tr>
                       <td class='table-border-none'  colspan="10">DIVISI NOODLE - PABRIK BANDUNG</td>
                       <td class='table-border-left' colspan="7">No. Terbitan:1.0</td>
                     </tr>
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                     </tr>
               </table>`;
        const footerPDF = `
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">Padalarang, ${dateCurr.getDate()} ${fullMonthNames[dateCurr.getMonth()]} ${dateCurr.getFullYear()}</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none text-center'  colspan="5">
                           Diajukan Oleh,

                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                        <td class='table-border-none text-center' colspan="3">
                            Disetujui Oleh,
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-top text-center' colspan="5">
                            ${permintaan.pengguna_pengajuan.nama}
                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                       <td class='table-border-top text-center' colspan="3">
                            ${permintaan.pengguna_persetujuan.nama}
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>`;
        this.modalBody().innerHTML = `
                ${headerPDF}
                <br>
                <table class="pdf-table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>FORM PERMINTAAN ALAT TULIS KANTOR(ATK)</b></td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table  style="width:350px"><tr><td width="30%">Bulan</td> <td width="70%">: ${fullMonthNames[datePermintaan.getMonth()]} ${datePermintaan.getFullYear()}</td></tr></table></td>
                     </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table style="width:350px"><tr><td width="30%">Departemen</td> <td width="70%">: <b>${permintaan.departemen.nama}</b></td></tr></table></td>
                    </tr>
                    <tr>
                        <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" width="5%" >NO</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="20%" >JENIS BARANG</td>
                        <td  class='table-border-full text-center'  style="background-color:#d0d0d0;" colspan="2"width="12%" >SATUAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="2"  width="12%">STOCK BARANG</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="12%" >KEBUTUHAN</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="12%" >TOTAL PERMINTAAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  width="30%" >KETERANGAN</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                    <tbody id="data-table-1-pdf">

                    </tbody>
                    ${footerPDF}
               </table>
        `;
        let counter = 1;
        let pages = 1;
        for (const brg of permintaan.daftar_barang) {
            this.dataTable(pages).insertAdjacentHTML('beforeend',
                `<tr>
                <td class='table-border-none' >&nbsp</td>
                <td class='table-border-full p-1' >${counter}</td>
                <td class='table-border-full p-1' colspan="4" >${brg.jenis_barang.nama}</td>
                <td  class='table-border-full p-1' colspan="2" >${brg.jenis_barang.satuan}</td>
                <td class='table-border-full p-1 text-center' colspan="2" >10</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >${brg.kebutuhan}</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >-99</td>
                <td class='table-border-full p-1'  >${brg.keterangan}</td>
                <td class='table-border-none' >&nbsp</td>
             </tr>
            `);
            counter++;
        }
    },
}
