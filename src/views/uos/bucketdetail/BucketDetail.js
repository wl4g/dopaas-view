import {transDate, getDay} from 'utils/'

export default {
    name: 'bucketDetail',
    data() {
        return {
            cossProvider: '',
            bucketName: '',

            loading: false,

            indexData: {
                storageUsage: 0,
                storageUsageUnit: 'B',
                numberOfRequests: 0,
                numberOfDocuments: 0,
            },
        }
    },

    mounted() {

    },

    activated() {
        this.cossProvider = this.$route.query.cossProvider;
        this.bucketName = this.$route.query.bucketName;

        this.$$api_uos_getBucketIndex({
            data: {
                cossProvider: this.cossProvider,
                bucketName: this.bucketName,
            }, fn: json => {
                this.indexData = json.data;
                this.fixUnit();
            }
        });
    },

    methods: {
        toFs() {
            this.$router.push({path: this.permitutil.getRoutePathByPermission('coss:bucket:fs'), query: {cossProvider: this.cossProvider, bucketName: this.bucketName,}})
        },

        back() {
            this.$router.push({path: this.permitutil.getRoutePathByPermission('coss:bucket')})
        },

        fixUnit(){
            if(this.indexData.storageUsage<=1024){
                this.indexData.storageUsageUnit = 'B';
            }else if(1024<this.indexData.storageUsage && this.indexData.storageUsage<=(1024*1024)){
                this.indexData.storageUsage = Math.round(this.indexData.storageUsage / 1024);
                this.indexData.storageUsageUnit = 'KB';
            }else if(1024*1024<this.indexData.storageUsage && this.indexData.storageUsage<=1024*1024*1024){
                this.indexData.storageUsage = Math.round(this.indexData.storageUsage / (1024*1024));
                this.indexData.storageUsageUnit = 'MB';
            }else if(1024*1024*1024<this.indexData.storageUsage && this.indexData.storageUsage<=1024*1024*1024*1024){
                this.indexData.storageUsage = Math.round(this.indexData.storageUsage / (1024*1024*1024));
                this.indexData.storageUsageUnit = 'GB';
            }else if(1024*1024*1024*1024<this.indexData.storageUsage){
                this.indexData.storageUsage = Math.round(this.indexData.storageUsage / (1024*1024*1024*1024));
                this.indexData.storageUsageUnit = 'TB';
            }
            console.info(this.indexData.storageUsage);
        }


    }
}
