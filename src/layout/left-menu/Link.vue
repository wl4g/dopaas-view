<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>
import {cache} from '../../utils/'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    item: {
      type: Object,
    }
  },
  methods: {
    linkProps(url) {
      if (this.item.type == 1) {//静态menu
        return {
          is: 'router-link',
          to: url
        }
      } else if (this.item.type == 2) {//动态menu
        var expression = this.item.pageLocation;
        var startIndex = expression.indexOf("${");
        var endIndex = expression.indexOf("}");
        // 是否使用表达式解析，否则不改变pageLocation
        if (startIndex >= 0 && endIndex > 0) {
          let sysModuleCache = cache.get("iamSysModules");
          var internelExp = expression.substring(startIndex + 2, endIndex);
          var parts = internelExp.split(".");
          var obj1 = parts[0].replaceAll("'", "").replaceAll("\"", ""); // keyof appName
          var obj11 = parts[1].replaceAll("'", "").replaceAll("\"", ""); // keyof extranetBaseUri
          this.item.pageLocation = sysModuleCache[obj1][obj11];
        }

        if (this.item && this.item && this.item.renderTarget && this.item.renderTarget == '_blank' && this.item.pageLocation.startsWith('http')) {
          return {
            is: 'a',
            href: this.item.pageLocation,
            target: '_blank',
            rel: 'noopener'
          }
        } else {
          return {
            is: 'router-link',
            to: url
          }
        }
      }


    }
  }
}
</script>
