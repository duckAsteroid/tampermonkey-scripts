const mutationObserverInitOptions = {
    // Required, and observes additions or deletion of child nodes
    childList: true,
    // Observes the addition or deletion of “grandchild” nodes
    subtree: true,
    // Observe mutations to target's attributes
    attributes: true,
    // record  target's attribute value before the mutation
    attributeOldValue: true,
    // Only observe changes to `src` attribute
    attributeFilter: ['src']
  };


  /**
   * 
   * 
   * Inspired by https://github.com/digidem/img-observer
   */
class ImageReplacementMonitor {
    constructor(replacements) {
        this.imageReplacements = new Map(replacements);
    }

    monitor(root) {
        const tagName = 'IMG'
        const observer = new MutationObserver(function (mutations) {
            for(const mutation of mutations) {
                // atttribute change (can only be source due to our setup)
                if (mutation.type === 'attributes') {
                    processImageNode(mutation.target);
                    continue;
                }
                // Check whether any added nodes are an IMG tag, and if so
                filterNodeList(mutation.addedNodes, tagName).forEach(processImageNode);
            }
        });
    }

    processImageNode(img) {
        this.imageReplacements.forEach((value, key) => {
            if (img.src == key) {
                img.src = value;
            }
        });
    }
}

function filterNodeList(nodeList, tagName) {
    var matched = [];
    for (var i = 0; i < nodeList.length; ++i) {
      // Only check node nodes, not text or script nodes.
      if (nodeList[i].nodeType !== window.Node.ELEMENT_NODE) continue;
      // Check if the root node is what we are looking for
      if (nodeList[i].tagName === tagName) {
        matched.push(nodeList[i]);
        // If the node has no children, continue to next node
        if (!nodeList[i].children.length) continue;
      }
  
      // Check for any children
      var children = nodeList[i].getElementsByTagName(tagName)
      for (var j = 0; j < children.length; ++j) {
        matched.push(children[j]);
      }
    }
    return matched;
  }