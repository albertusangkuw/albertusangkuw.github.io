const settingsSelectDepartemen = {
    valueField: 'kode',
    labelField: 'nama',
    searchField: ['kode','nama'],
    sortField: {
        field: "text",
        direction: "asc"
    },
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('departemen')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });
    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
							<div class="mb-1">
								<span class="h5">
									${ escape(item.nama) }
								</span>
							</div>
					 		<div class="ms-auto">${ escape(item.kode) }</div>
						</div>`;
        }
    },
};

const settingsSelectPengguna = {
    valueField: 'id',
    labelField: 'nama',
    searchField: ['id','nama' ,'jabatan' ,'username'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('pengguna')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
                        <div class="mb-1">
                            <span class="h5">
                                ${ escape(item.nama) }
                            </span>
                        </div>
                        <div class="ms-auto">${ escape(item.jabatan) }</div>
                    </div>`;
        }
    },
};

const settingsSelectJenisBarang = {
    valueField: 'kode',
    labelField: 'nama',
    searchField: ['kode', 'nama'],
    // fetch remote data
    load: function (query, callback) {
        var self = this;
        if (self.loading > 1) {
            callback();
            return;
        }
        getData('jenis_barang').then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(() => {
            callback();
        });
    },
    // custom rendering function for options
    render: {
        option: function (item, escape) {
            return `<div class="py-2 d-flex">
							<div class="mb-1">
								<span class="h5">
									${escape(item.nama)}
								</span>
							</div>
					 		<div class="ms-auto">${escape(item.kode)}</div>
						</div>`;
        }
    },
};

const settingsHakAkses = {
    valueField: 'int',
    labelField: 'string',
    searchField: ['int','string'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData("/pengguna/hak_akses").then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
							<div class="mb-1">
								<span class="h5">
									${ escape(item.string) }
								</span>
							</div>
					 		<div class="ms-auto">${ escape(item.int) }</div>
						</div>`;
        }
    },
} ;

const settingsSelectPermintaan = {
    valueField: 'id',
    labelField: 'tanggal_permintaan',
    searchField: ['tanggal_permintaan','id', 'tenggat_waktu_barang', 'id_pengguna_pengajuan', 'id_pengguna_persetujuan'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('permintaan')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
                    <div class="mb-1">
                        <span class="h5">
                            ${ escape(item.tanggal_permintaan) }
                        </span>
                    </div>
                    <div class="ms-auto">${ escape(item.id) }</div>
                </div>`;
        }
    },
};

const settingsSelectTandaTerima = {
    valueField: 'id',
    labelField: 'id',
    searchField: ['id_pengguna_penerima','id_pengguna_pemberi', 'kode_departemen' , 'tanggal'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('tanda_terima')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
                <div class="mb-1">
                    <span class="h5">
                        ${ escape(item.id_pengguna_penerima) }
                    </span>
                </div>
                <div class="ms-auto">${ escape(item.id) }</div>
            </div>`;
        }
    },
};

const settingsStatusBarang = {
    valueField: 'int',
    labelField: 'string',
    searchField: ['int','string'],
    sortField:[{field:'item.int'}],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }
        getData('/barang/status').then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
							<div class="mb-1">
								<span class="h5">
									${ escape(item.string) }
								</span>
							</div>
					 		<div class="ms-auto">${ escape(item.int) }</div>
						</div>`;
        }
    },
} ;

const settingsSelectPenyesuaianStok= {
    valueField: 'id',
    labelField: 'tanggal',
    searchField: ['tanggal','id', 'kode_departemen'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('penyesuaian_stok')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
                    <div class="mb-1">
                        <span class="h5">
                            ${ escape(item.tanggal) } - ${ escape(item.kode_departemen) }
                        </span>
                    </div>
                    <div class="ms-auto">${ escape(item.id) }</div>
                </div>`;
        }
    },
};

const settingsSelectPermintaanBarang = {
    valueField: 'id',
    labelField: 'kode_jenis_barang',
    searchField: ['kode_jenis_barang','keterangan', 'id_permintaan'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('permintaan_barang')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
                    <div class="mb-1">
                        <span class="h6">
                            Permintaan:<br>
                            ${ escape(item.permintaan.tanggal_permintaan) } , ${ escape(item.permintaan.kode_departemen) }
                        </span>
                        <span class="h5">
                               ${ escape(item.jenis_barang.nama) }( ${ escape(item.jenis_barang.kode) })
                        </span>
                    </div>
                    <div class="ms-auto">${ escape(item.id) }</div>
                </div>`;
        }
    },
};

const settingsSelectBarang = {
    valueField: 'id',
    labelField: 'kode_jenis_barang',
    searchField: ['kode_jenis_barang'],
    // fetch remote data
    load: function(query, callback) {
        var self = this;
        if( self.loading > 1 ){
            callback();
            return;
        }

        getData('barang')
            .then(json => {
                callback(json);
                self.settings.load = null;
            }).catch(()=>{
            callback();
        });

    },
    onFocus: function(){
        this.load();
    },
    // custom rendering function for options
    render: {
        option: function(item, escape) {
            return `<div class="py-2 d-flex">
                    <div class="mb-1">
                        <span class="h6">
                            Permintaan:<br>
                            ${ escape(item.kode_jenis_barang) } [${ escape(item.stock) } ${ escape(item.jenis_barang.satuan) } ]
                        </span>
                        <span class="h5">
                               ${ getValueIf(item.kode_departemen,'',"-") } (${ escape(item.status) })
                        </span>
                    </div>
                    <div class="ms-auto">${ escape(item.id) }</div>
                </div>`;
        }
    },
};
