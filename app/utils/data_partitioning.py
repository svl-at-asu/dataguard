from itertools import combinations
import numpy as np
from more_itertools import set_partitions

def create_partitions(data, sensitive_column):
    unique_values = sorted(list(set([item[sensitive_column] for item in data])))
    
    partitions = [[{**item, sensitive_column: str(item[sensitive_column])} for item in data]]
    
    for k in range(1, len(unique_values)): 
        stirling_partitions = generate_stirling_partitions(data, sensitive_column, k, unique_values)
        partitions.extend(stirling_partitions)
    
    return partitions

def generate_stirling_partitions(data, sensitive_column, k, unique_values):

    partitioned_datasets = []
    
    for partition in set_partitions(unique_values, k):
        valid_partition = []
        
        for subset in partition:
            subset = sorted(subset)  
            if len(set(subset)) == len(subset): 
                valid_partition.append(subset)

        if valid_partition:
            grouped_dataset = []
            for subset in valid_partition:
                grouped_subset = [{**item, sensitive_column: ', '.join(map(str, subset))} for item in data if item[sensitive_column] in subset]
                grouped_dataset.extend(grouped_subset)
            partitioned_datasets.append(grouped_dataset)
    
    return partitioned_datasets
