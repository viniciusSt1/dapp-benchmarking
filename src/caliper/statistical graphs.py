import os
import matplotlib 
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

REPORTS_DIR = "./reports_csv/experiments"
OUTPUT_STATISTICAL_GRAPHS = "./reports_statistical_graphs"

os.makedirs(OUTPUT_STATISTICAL_GRAPHS, exist_ok=True)

colors = {
    'Open': '#1f77b4',      
    'Query': '#ff7f0e',     
    'Transfer': '#2ca02c'
}

markers = {
    'Open': 'o',
    'Query': '^',
    'Transfer': 's'
}


def besu_average_throughput():
# lista cada subpasta dentro da pasta 'experiments'
    if not os.path.exists(REPORTS_DIR):
        print(f"Diretorio nao encontrado: {REPORTS_DIR}")   
        return
    
    itens = os.listdir(REPORTS_DIR)
    print(itens)
    experimental_folders = [item for item in itens if os.path.isdir(os.path.join(REPORTS_DIR, item))]
    
    print(f"Pastas encontradas {len(experimental_folders)} para realizar o processamento .\n")
    
    for experimental_name in experimental_folders:
        print(f"--- Processando: {experimental_name} ---")
        
        experimental_path = os.path.join(REPORTS_DIR, experimental_name)
        
        archives = {
        'Open': os.path.join(experimental_path, 'open', 'caliper_performance_metrics.csv'),
        'Query': os.path.join(experimental_path, 'query', 'caliper_performance_metrics.csv'),
        'Transfer': os.path.join(experimental_path, 'transfer', 'caliper_performance_metrics.csv')
        }
    
        fig, ax1 = plt.subplots(figsize=(12,7))
        ax2 = ax1.twinx()
    
        lines_captions = []
        ploted_data = False
    
    # le e plota cada arquivo
        for nome_funcao, arquivo in archives.items():
            if not os.path.exists(arquivo):
                print(f"Arquivo não encontrado: .../{nome_funcao}/caliper_performance_metrics.csv")
        
            try:
                df = pd.read_csv(arquivo)
            
                cols_numericas = ['Throughput (TPS)', 'Avg Latency (s)', 'TPS']
                df.columns = df.columns.str.strip()
            
                for col in cols_numericas:           
                    if col in df.columns:
                        df[col] = pd.to_numeric(df[col], errors='coerce')
                    else:
                        print(f"Coluna {col} nao encontrada em {nome_funcao}")
                        continue
                
                df = df.dropna(subset=['Throughput (TPS)', 'Avg Latency (s)'])
            
                if df.empty:
                    print(f"Arquivo {nome_funcao} está vazio ou com dados inválidos.")
                    continue
        
                # Agrupa por TPS (Carga) e calcula média e desvio padrão
                grouped = df.groupby('TPS').agg({
                    'Throughput (TPS)': ['mean', 'std'],
                    'Avg Latency (s)': ['mean', 'std']
                })
        
                # Achata os nomes das colunas
                grouped.columns = ['_'.join(col) for col in grouped.columns]
                x = grouped.index

                color = colors.get(nome_funcao, 'black')
                marker = markers.get(nome_funcao, 'o')

                # --- PLOT 1: Throughput (Eixo Esquerdo - Linha Sólida) ---
                ln1 = ax1.errorbar(x, grouped['Throughput (TPS)_mean'], 
                        yerr=grouped['Throughput (TPS)_std'], 
                        fmt=f'-{marker}', color=color, label=f'{nome_funcao} TPS',
                        capsize=3, linewidth=2, alpha=0.9)
        
                # --- PLOT 2: Latency (Eixo Direito - Linha Tracejada) ---
                ln2 = ax2.errorbar(x, grouped['Avg Latency (s)_mean'], 
                    yerr=grouped['Avg Latency (s)_std'], 
                    fmt=f'--{marker}', color=color, label=f'{nome_funcao} Latency',
                    capsize=3, linewidth=2, alpha=0.6)

                lines_captions.extend([ln1, ln2])
                ploted_data = True
                print(f"{nome_funcao} processado.")

            except Exception as e:
                print(f"Erro ao ler {nome_funcao}: {e}")

        if ploted_data:
            ax1.set_xlabel('Transaction send rate (req/s)', fontsize=12, fontweight='bold')
            ax1.set_ylabel('Average Throughput (TPS)', fontsize=12, fontweight='bold')
            ax1.grid(True, linestyle=':', alpha=0.6)

            ax2.set_ylabel('Average Latency (s)', fontsize=12, fontweight='bold')

            plt.title('Performance Comparison: Open vs Query vs Transfer', fontsize=14, pad=20)

            legenda_handles = [l for l in lines_captions]
            legenda_labels = [l.get_label() for l in lines_captions]

            ax1.legend(legenda_handles, legenda_labels, loc='upper center', 
            bbox_to_anchor=(0.5, -0.15), ncol=3, frameon=True, fancybox=True, shadow=True)

            plt.tight_layout()
            plt.subplots_adjust(bottom=0.2)
        
            output_file = f"grafico_{experimental_name}.png"
            final_path = os.path.join(OUTPUT_STATISTICAL_GRAPHS, output_file)

            plt.savefig(final_path, dpi=300)
            print(f"Salvo em: {final_path}\n")
            plt.close()
        else:
            print(" Nenhum dado válido encontrado nesta pasta. Gráfico ignorado.\n")
            plt.close()
            
besu_average_throughput()
